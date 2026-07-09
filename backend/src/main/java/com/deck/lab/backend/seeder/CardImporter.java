package com.deck.lab.backend.seeder;

import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PreDestroy;

/**
 * Importer class responsible for fetching Yu-Gi-Oh! card catalog datasets from
 * external APIs and seeding the database.
 *
 * <p>
 * <strong>Card Importer</strong>
 * </p>
 * <p>
 * Retrieves card data from the YGOPRODeck REST API, converts the payload into
 * JPA entities, saves them in batches, and asynchronously downloads artwork
 * images. Relies on several Spring and Java concurrency features.
 * </p>
 *
 * <ul>
 * <li><strong>REST Client:</strong>
 * Leverages Spring's {@link RestClient} to perform standard, synchronous HTTP
 * GET requests. {@code RestClient} offers an elegant fluent API interface that
 * wraps default Java HTTP connections.</li>
 * <li><strong>Batch Database Transactions:</strong>
 * Inserting thousands of cards one-by-one is slow and risks table locks. This
 * importer splits data into sublists (defined by {@code batchSize}) and runs
 * each batch save inside a separate programmatic {@link TransactionTemplate}
 * boundary. This optimizes Hibernate's batch write settings.</li>
 * <li><strong>Background Image Caching:</strong>
 * Card artwork images are large. To prevent blocking the main boot thread,
 * images are queued and downloaded concurrently using a fixed-size thread pool
 * managed by {@link ExecutorService}. Downloaded files are cached locally in
 * the filesystem configuration directory so that the application serves them
 * locally.</li>
 * <li><strong>Graceful Shutdown via {@link PreDestroy}:</strong>
 * When the Spring container is stopped, the method decorated with
 * {@code @PreDestroy} is automatically invoked to shut down the image download
 * thread pool, terminating active tasks and preventing memory leaks or orphaned
 * OS threads.</li>
 * </ul>
 */
@Component
public class CardImporter {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CardRepository cardRepository;
    private final TransactionTemplate transactionTemplate;
    private final RestClient restClient;
    private final Executor imageDownloadExecutor;
    private final ObjectMapper objectMapper;

    @Value("${app.ygoprodeck.api-url:https://db.ygoprodeck.com/api/v7/cardinfo.php}")
    private String apiUrl;

    @Value("${app.ygoprodeck.batch-size:500}")
    private int batchSize;

    @Value("${app.ygoprodeck.connect-timeout:5000}")
    private int connectTimeout;

    @Value("${app.ygoprodeck.read-timeout:5000}")
    private int readTimeout;

    @Value("${app.upload-dir:data/images}")
    private String uploadDir;

    public CardImporter(CardRepository cardRepository,
            PlatformTransactionManager transactionManager,
            Executor imageDownloadExecutor) {
        this.cardRepository = cardRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.restClient = RestClient.builder()
                .defaultHeader("User-Agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .build();
        this.imageDownloadExecutor = imageDownloadExecutor;
        this.objectMapper = new ObjectMapper();
    }

    public List<Card> fetchAllCards(
            String apiUrl,
            int batchSize,
            int connectTimeout,
            int readTimeout) {
        List<Card> allCards = new ArrayList<>();
        int offset = 0;

        logger.info("Starting full card fetch from YGOProDeck API (batch size: {})", batchSize);

        while (true) {
            if (Thread.currentThread().isInterrupted()) {
                logger.info("Fetch all cards interrupted. Aborting.");
                break;
            }

            URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                    .queryParam("num", batchSize)
                    .queryParam("offset", offset)
                    .build()
                    .toUri();

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .toEntity(Map.class);
            if (response == null || !response.getBody().containsKey("data")) {
                break;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = response.getBody();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
            if (dataList == null || dataList.isEmpty()) {
                break;
            }

            for (Map<String, Object> apiCard : dataList) {
                if (Thread.currentThread().isInterrupted()) {
                    break;
                }
                Card card = mapApiResponseToCard(apiCard);
                if (card != null) {
                    allCards.add(card);
                }
            }

            logger.info("Fetched {} cards (offset {})", dataList.size(), offset);

            if (dataList.size() < batchSize) {
                break;
            }
            offset += batchSize;
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        logger.info("Finished fetching {} total cards from YGOProDeck API", allCards.size());
        return allCards;
    }

    Card mapApiResponseToCard(Map<String, Object> apiCard) {
        Number idNum = (Number) apiCard.get("id");
        if (idNum == null)
            return null;

        Long apiId = idNum.longValue();
        String name = (String) apiCard.get("name");
        String type = (String) apiCard.get("type");
        String description = (String) apiCard.get("desc");
        String race = (String) apiCard.get("race");
        String attribute = (String) apiCard.get("attribute");
        String archetype = (String) apiCard.get("archetype");
        String frameType = (String) apiCard.get("frameType");

        CardType cardType = null;
        try {
            cardType = CardType.fromString(type);
        } catch (IllegalArgumentException e) {
            logger.warn("Unknown card type: {}", type);
        }

        FrameType frameTypeEnum = null;
        try {
            frameTypeEnum = FrameType.fromString(frameType);
        } catch (IllegalArgumentException e) {
            logger.warn("Unknown frame type: {}", frameType);
        }

        CardRace cardRace = null;
        try {
            cardRace = CardRace.fromString(race);
        } catch (IllegalArgumentException e) {
            logger.warn("Unknown card race: {}", race);
        }

        CardAttribute cardAttribute = null;
        try {
            cardAttribute = CardAttribute.fromString(attribute);
        } catch (IllegalArgumentException e) {
            logger.warn("Unknown card attribute: {}", attribute);
        }

        String imageUrl = "cards/images/" + apiId + ".jpg";
        String imageUrlCropped = "cards/images/cropped/" + apiId + ".jpg";

        Integer atk = (Integer) apiCard.get("atk");
        Integer def = (Integer) apiCard.get("def");
        Integer level = (Integer) apiCard.get("level");
        Integer linkVal = (Integer) apiCard.get("linkval");
        Integer scale = (Integer) apiCard.get("scale");

        Card card = new Card(name, cardType, frameTypeEnum, description, cardRace, cardAttribute, archetype, imageUrl,
                imageUrlCropped,
                atk, def, level, linkVal, scale);

        // Extract remote URLs and trigger async download
        String remoteImageUrl = null;
        String remoteImageUrlCropped = null;
        if (apiCard.containsKey("card_images")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> cardImages = (List<Map<String, Object>>) apiCard.get("card_images");
            if (cardImages != null && !cardImages.isEmpty()) {
                Map<String, Object> firstImage = cardImages.get(0);
                remoteImageUrl = (String) firstImage.get("image_url");
                remoteImageUrlCropped = (String) firstImage.get("image_url_cropped");
            }
        }
        triggerImageDownloads(apiId, remoteImageUrl, remoteImageUrlCropped);

        return card;
    }

    private void triggerImageDownloads(Long apiId, String remoteImageUrl, String remoteImageUrlCropped) {
        if (Thread.currentThread().isInterrupted()) {
            return;
        }
        if (remoteImageUrl != null) {
            Path fullPath = Paths.get(uploadDir, apiId + ".jpg");
            if (!Files.exists(fullPath)) {
                imageDownloadExecutor.execute(() -> downloadImage(remoteImageUrl, fullPath));
            }
        }
        if (remoteImageUrlCropped != null) {
            Path croppedPath = Paths.get(uploadDir, "cropped", apiId + ".jpg");
            if (!Files.exists(croppedPath)) {
                imageDownloadExecutor.execute(() -> downloadImage(remoteImageUrlCropped, croppedPath));
            }
        }
    }

    private void downloadImage(String remoteUrl, Path destinationPath) {
        try {
            Files.createDirectories(destinationPath.getParent());
            byte[] imageBytes = restClient.get()
                    .uri(remoteUrl)
                    .retrieve()
                    .body(byte[].class);
            if (imageBytes != null) {
                Files.write(destinationPath, imageBytes);
            }
        } catch (Exception e) {
            logger.warn("Failed to download image from {}: {}", remoteUrl, e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private List<Card> loadCardsFromLocalJson() {
        try {
            ClassPathResource resource = new ClassPathResource("cards_full.json");
            if (!resource.exists()) {
                logger.info("Local cards JSON resource not found at classpath:cards_full.json");
                return null;
            }
            logger.info("Loading cards from local JSON resource classpath:cards_full.json...");
            try (InputStream is = resource.getInputStream()) {
                Map<String, Object> response = objectMapper.readValue(is, new TypeReference<Map<String, Object>>() {
                });
                if (response == null || !response.containsKey("data")) {
                    logger.warn("Invalid local cards JSON content: 'data' key missing");
                    return null;
                }
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.get("data");
                if (dataList == null || dataList.isEmpty()) {
                    return null;
                }
                List<Card> cards = new ArrayList<>();
                for (Map<String, Object> apiCard : dataList) {
                    if (Thread.currentThread().isInterrupted()) {
                        break;
                    }
                    Card card = mapApiResponseToCard(apiCard);
                    if (card != null) {
                        cards.add(card);
                    }
                }
                logger.info("Successfully loaded {} cards from local JSON", cards.size());
                return cards;
            }
        } catch (Exception e) {
            logger.error("Failed to load cards from local JSON resource", e);
            return null;
        }
    }

    public void seedCardsFromApi() {
        long existingCount = cardRepository.count();
        if (existingCount > 100) {
            logger.info("Database already contains {} cards. Skipping full API import.", existingCount);
            return;
        }

        logger.info("Seeding cards...");
        try {
            List<Card> apiCards = loadCardsFromLocalJson();
            boolean fromLocal = true;
            if (apiCards == null || apiCards.isEmpty()) {
                logger.info("Falling back to YGOProDeck API for card seeding...");
                apiCards = fetchAllCards(apiUrl, batchSize, connectTimeout, readTimeout);
                fromLocal = false;
            }

            int created = 0;
            int skipped = 0;

            List<Card> toSave = new ArrayList<>();

            List<Card> existingCardsList = cardRepository.findAll();
            Map<String, Card> existingCardsByName = existingCardsList.stream()
                    .collect(Collectors.toMap(c -> c.getName().toLowerCase(), c -> c, (a, b) -> a));

            for (Card apiCard : apiCards) {
                if (Thread.currentThread().isInterrupted()) {
                    logger.info("Card seeding interrupted. Aborting.");
                    break;
                }

                Card existingByName = existingCardsByName.get(apiCard.getName().toLowerCase());
                if (existingByName != null) {
                    boolean updated = false;
                    if (existingByName.getImageUrl() == null) {
                        existingByName.setImageUrl(apiCard.getImageUrl());
                        updated = true;
                    }
                    if (existingByName.getImageUrlCropped() == null) {
                        existingByName.setImageUrlCropped(apiCard.getImageUrlCropped());
                        updated = true;
                    }
                    if (existingByName.getFrameType() == null) {
                        existingByName.setFrameType(apiCard.getFrameType());
                        updated = true;
                    }
                    if (existingByName.getAtk() == null) {
                        existingByName.setAtk(apiCard.getAtk());
                        updated = true;
                    }
                    if (existingByName.getDef() == null) {
                        existingByName.setDef(apiCard.getDef());
                        updated = true;
                    }
                    if (existingByName.getLevel() == null) {
                        existingByName.setLevel(apiCard.getLevel());
                        updated = true;
                    }
                    if (existingByName.getLinkVal() == null) {
                        existingByName.setLinkVal(apiCard.getLinkVal());
                        updated = true;
                    }
                    if (existingByName.getScale() == null) {
                        existingByName.setScale(apiCard.getScale());
                        updated = true;
                    }

                    if (updated) {
                        toSave.add(existingByName);
                    }
                    skipped++;
                    continue;
                }

                toSave.add(apiCard);
                created++;

                if (toSave.size() >= 500) {
                    if (Thread.currentThread().isInterrupted()) {
                        break;
                    }
                    final List<Card> batch = new ArrayList<>(toSave);
                    transactionTemplate.executeWithoutResult(status -> cardRepository.saveAll(batch));
                    toSave.clear();
                }
            }

            if (!toSave.isEmpty() && !Thread.currentThread().isInterrupted()) {
                final List<Card> batch = new ArrayList<>(toSave);
                transactionTemplate.executeWithoutResult(status -> cardRepository.saveAll(batch));
            }

            logger.info("Card seeding complete (from {}): {} created, {} skipped (already existed)",
                    fromLocal ? "local JSON" : "API", created, skipped);
        } catch (Exception e) {
            logger.error("Failed to seed cards.", e);
        }
    }

}
