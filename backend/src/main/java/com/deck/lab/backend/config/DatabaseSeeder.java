package com.deck.lab.backend.config;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.repository.UserRepository;

import jakarta.annotation.PreDestroy;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DeckRepository deckRepository;
    private final TransactionTemplate transactionTemplate;
    private final RestClient restClient;
    private final ExecutorService imageDownloadExecutor = Executors.newFixedThreadPool(5);

    @Value("${app.seed.cards:true}")
    private boolean seedCardsEnabled;

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

    public DatabaseSeeder(CardRepository cardRepository,
            FormatRulesRepository formatRulesRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            DeckRepository deckRepository,
            PlatformTransactionManager transactionManager) {
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.deckRepository = deckRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.restClient = RestClient.create();
    }

    @PreDestroy
    public void shutdownExecutor() {
        logger.info("Shutting down card image downloader executor...");
        imageDownloadExecutor.shutdown();
    }

    @Override
    public void run(String... args) throws Exception {
        transactionTemplate.executeWithoutResult(status -> {
            seedUser("admin", "12345678", "admin@example.com");
            seedUser("yugi", "12345678", "yugi@example.com");
        });

        if (seedCardsEnabled) {
            seedCardsFromApi();
            seedBanlistsFromApi();
            seedHistoricalBanlists();
        } else {
            logger.info("Card seeding is disabled (app.seed.cards=false). Skipping.");
        }

        transactionTemplate.executeWithoutResult(status -> {
            seedSampleDecks();
        });
    }

    // -----------------------------------------------------------------------
    // Card seeding from API
    // -----------------------------------------------------------------------

    public List<Card> fetchAllCards(
            String apiUrl,
            int batchSize,
            int connectTimeout,
            int readTimeout) {
        List<Card> allCards = new ArrayList<>();
        int offset = 0;

        logger.info("Starting full card fetch from YGOProDeck API (batch size: {})", batchSize);

        while (true) {
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

        String imageUrl = "cards/images/" + apiId + ".jpg";
        String imageUrlCropped = "cards/images/cropped/" + apiId + ".jpg";

        Integer atk = (Integer) apiCard.get("atk");
        Integer def = (Integer) apiCard.get("def");
        Integer level = (Integer) apiCard.get("level");
        Integer linkVal = (Integer) apiCard.get("linkval");
        Integer scale = (Integer) apiCard.get("scale");

        Card card = new Card(name, type, frameType, description, race, attribute, archetype, imageUrl, imageUrlCropped,
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
        if (remoteImageUrl != null) {
            Path fullPath = Paths.get(uploadDir, apiId + ".jpg");
            if (!Files.exists(fullPath)) {
                imageDownloadExecutor.submit(() -> downloadImage(remoteImageUrl, fullPath));
            }
        }
        if (remoteImageUrlCropped != null) {
            Path croppedPath = Paths.get(uploadDir, "cropped", apiId + ".jpg");
            if (!Files.exists(croppedPath)) {
                imageDownloadExecutor.submit(() -> downloadImage(remoteImageUrlCropped, croppedPath));
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

    private void seedCardsFromApi() {
        long existingCount = cardRepository.count();
        if (existingCount > 100) {
            logger.info("Database already contains {} cards. Skipping full API import.", existingCount);
            return;
        }

        logger.info("Seeding cards from YGOProDeck API...");
        try {
            List<Card> apiCards = fetchAllCards(apiUrl, batchSize, connectTimeout, readTimeout);
            int created = 0;
            int skipped = 0;

            // Batch insert — collect all new cards, then saveAll in chunks
            List<Card> toSave = new ArrayList<>();

            // Preload existing cards to prevent N+1 selects inside the loop
            List<Card> existingCardsList = cardRepository.findAll();
            Map<String, Card> existingCardsByName = existingCardsList.stream()
                    .collect(Collectors.toMap(c -> c.getName().toLowerCase(), c -> c, (a, b) -> a));

            for (Card apiCard : apiCards) {
                // Check by name from preloaded map to prevent database roundtrips
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

                // Save in batches of 500 inside separate short-lived transactions
                if (toSave.size() >= 500) {
                    final List<Card> batch = new ArrayList<>(toSave);
                    transactionTemplate.executeWithoutResult(status -> cardRepository.saveAll(batch));
                    toSave.clear();
                }
            }

            if (!toSave.isEmpty()) {
                final List<Card> batch = new ArrayList<>(toSave);
                transactionTemplate.executeWithoutResult(status -> cardRepository.saveAll(batch));
            }

            logger.info("Card seeding complete: {} created, {} skipped (already existed)", created, skipped);
        } catch (Exception e) {
            logger.error("Failed to seed cards from YGOProDeck API.", e);
        }
    }

    // -----------------------------------------------------------------------
    // Banlist seeding from API
    // -----------------------------------------------------------------------

    private void seedBanlistsFromApi() {
        logger.info("Seeding banlists from YGOProDeck API...");

        // The API supports tcg, ocg, and goat banlists
        Map<String, String> apiFormatMapping = Map.of(
                "tcg", "TCG",
                "ocg", "OCG",
                "goat", "Goat");

        for (Map.Entry<String, String> entry : apiFormatMapping.entrySet()) {
            String apiFormat = entry.getKey();
            String localFormat = entry.getValue();

            try {
                // Skip if we already have rules for this format
                List<FormatRules> existingRules = formatRulesRepository.findByFormatName(localFormat);
                if (!existingRules.isEmpty()) {
                    logger.info("Banlist for {} already seeded ({} rules). Skipping.", localFormat,
                            existingRules.size());
                    continue;
                }

                // Fetch remote banlist outside transactions
                URI uri = UriComponentsBuilder.fromUriString(apiUrl)
                        .queryParam("banlist", apiFormat)
                        .build()
                        .toUri();

                @SuppressWarnings("rawtypes")
                ResponseEntity<Map> response = restClient.get()
                        .uri(uri)
                        .retrieve()
                        .toEntity(Map.class);

                if (response == null || response.getBody() == null || !response.getBody().containsKey("data")) {
                    logger.warn("No data returned for banlist format: {}", apiFormat);
                    continue;
                }

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.getBody().get("data");
                if (dataList == null || dataList.isEmpty()) {
                    continue;
                }

                // Preload cards to prevent N+1 selects inside mapping loop
                List<Card> allCardsList = cardRepository.findAll();
                Map<String, Card> cardsByName = allCardsList.stream()
                        .collect(Collectors.toMap(c -> c.getName().toLowerCase(), c -> c, (a, b) -> a));

                List<FormatRules> toSave = new ArrayList<>();

                for (Map<String, Object> apiCard : dataList) {
                    String cardName = (String) apiCard.get("name");
                    if (cardName == null) {
                        continue;
                    }

                    Card card = cardsByName.get(cardName.toLowerCase());
                    if (card == null) {
                        continue;
                    }

                    @SuppressWarnings("unchecked")
                    Map<String, Object> banlistInfo = (Map<String, Object>) apiCard.get("banlist_info");
                    if (banlistInfo == null) {
                        continue;
                    }

                    String statusStr = (String) banlistInfo.get("ban_" + apiFormat);
                    if (statusStr == null) {
                        continue;
                    }

                    CardStatus status = mapApiStatus(statusStr);
                    if (status == null) {
                        continue;
                    }

                    toSave.add(new FormatRules(localFormat, card, status));

                    if (toSave.size() >= 500) {
                        final List<FormatRules> batch = new ArrayList<>(toSave);
                        transactionTemplate.executeWithoutResult(txStatus -> formatRulesRepository.saveAll(batch));
                        toSave.clear();
                    }
                }

                if (!toSave.isEmpty()) {
                    final List<FormatRules> batch = new ArrayList<>(toSave);
                    transactionTemplate.executeWithoutResult(txStatus -> formatRulesRepository.saveAll(batch));
                }

                logger.info("Seeded banlist rules for {}", localFormat);
            } catch (Exception e) {
                logger.warn("Failed to seed banlist for {}", localFormat, e);
            }
        }
    }

    /**
     * Seeds banlist rules for historical formats not available in the API
     * (Edison, Tengu Plant, HAT Format).
     */
    private void seedHistoricalBanlists() {
        // Edison
        seedHistoricalFormatIfEmpty("Edison", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.FORBIDDEN,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));

        // Tengu Plant
        seedHistoricalFormatIfEmpty("Tengu Plant", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.LIMITED,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));

        // HAT Format
        seedHistoricalFormatIfEmpty("HAT Format", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.FORBIDDEN,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));
    }

    private void seedHistoricalFormatIfEmpty(String formatName, Map<String, CardStatus> rules) {
        List<FormatRules> existing = formatRulesRepository.findByFormatName(formatName);
        if (!existing.isEmpty()) {
            logger.info("Historical banlist for {} already seeded. Skipping.", formatName);
            return;
        }

        int seeded = 0;
        for (Map.Entry<String, CardStatus> entry : rules.entrySet()) {
            Optional<Card> cardOpt = cardRepository.findByName(entry.getKey());
            if (cardOpt.isPresent()) {
                formatRulesRepository.save(new FormatRules(formatName, cardOpt.get(), entry.getValue()));
                seeded++;
            } else {
                logger.warn("Card '{}' not found in DB for historical banlist {}", entry.getKey(), formatName);
            }
        }
        logger.info("Seeded {} historical banlist rules for {}", seeded, formatName);
    }

    private CardStatus mapApiStatus(String apiStatus) {
        if (apiStatus == null)
            return null;
        return switch (apiStatus.toLowerCase()) {
            case "banned" -> CardStatus.FORBIDDEN;
            case "limited" -> CardStatus.LIMITED;
            case "semi-limited" -> CardStatus.SEMI_LIMITED;
            default -> null;
        };
    }

    // -----------------------------------------------------------------------
    // Sample deck seeding
    // -----------------------------------------------------------------------

    private void seedSampleDecks() {
        userRepository.findByUsername("yugi").ifPresent(yugi -> {
            // 1. Frog OTK Deck
            seedFrogOtkDeck(yugi);

            // 2. Frog Monarch Deck
            seedFrogMonarchDeck(yugi);

            // 3. Vayu Turbo Deck
            seedVayuTurboDeck(yugi);

            // 4. Diva Hero Deck
            seedDivaHeroDeck(yugi);
        });

        userRepository.findByUsername("admin").ifPresent(admin -> {
            // Clean up existing decks for admin to ensure only the new ones are seeded
            deckRepository.findByUser(admin).forEach(deckRepository::delete);

            // 1. Lightsworn Deck
            seedLightswornDeck(admin);

            // 2. Quickdraw Dandywarrior Deck
            seedQuickdrawDandywarriorDeck(admin);
        });
    }

    private void seedFrogOtkDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Substitoad", "MAIN", 3));
        cards.add(new DeckCardInfo("Swap Frog", "MAIN", 3));
        cards.add(new DeckCardInfo("Dupe Frog", "MAIN", 3));
        cards.add(new DeckCardInfo("Ronintoadin", "MAIN", 3));
        cards.add(new DeckCardInfo("Poison Draw Frog", "MAIN", 3));
        cards.add(new DeckCardInfo("Fishborg Blaster", "MAIN", 2));
        cards.add(new DeckCardInfo("Treeborn Frog", "MAIN", 2));
        cards.add(new DeckCardInfo("Mass Driver", "MAIN", 3));
        cards.add(new DeckCardInfo("Moray of Greed", "MAIN", 3));
        cards.add(new DeckCardInfo("Hand Destruction", "MAIN", 3));
        cards.add(new DeckCardInfo("Salvage", "MAIN", 3));
        cards.add(new DeckCardInfo("Magical Stone Excavation", "MAIN", 3));
        cards.add(new DeckCardInfo("One for One", "MAIN", 1));
        cards.add(new DeckCardInfo("Giant Trunade", "MAIN", 1));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Card Destruction", "MAIN", 1));
        cards.add(new DeckCardInfo("Cold Wave", "MAIN", 1));
        cards.add(new DeckCardInfo("Foolish Burial", "MAIN", 1));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Tempest Magician", "EXTRA", 3));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 2));
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Mist Wurm", "EXTRA", 1));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new DeckCardInfo("Magical Android", "EXTRA", 2));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        seedDeck("Frog OTK", "Historical OTK using Substitoad and Mass Driver.", "Edison", user, cards);
    }

    private void seedFrogMonarchDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new DeckCardInfo("Raiza the Storm Monarch", "MAIN", 3));
        cards.add(new DeckCardInfo("Mobius the Frost Monarch", "MAIN", 1));
        cards.add(new DeckCardInfo("Thestalos the Firestorm Monarch", "MAIN", 1));
        cards.add(new DeckCardInfo("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new DeckCardInfo("Treeborn Frog", "MAIN", 2));
        cards.add(new DeckCardInfo("Swap Frog", "MAIN", 3));
        cards.add(new DeckCardInfo("Dupe Frog", "MAIN", 2));
        cards.add(new DeckCardInfo("Ronintoadin", "MAIN", 1));
        cards.add(new DeckCardInfo("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new DeckCardInfo("Battle Fader", "MAIN", 3));
        cards.add(new DeckCardInfo("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new DeckCardInfo("Chaos Sorcerer", "MAIN", 1));
        cards.add(new DeckCardInfo("Soul Exchange", "MAIN", 3));
        cards.add(new DeckCardInfo("Enemy Controller", "MAIN", 3));
        cards.add(new DeckCardInfo("Pot of Avarice", "MAIN", 2));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        cards.add(new DeckCardInfo("Mystical Space Typhoon", "MAIN", 2));
        cards.add(new DeckCardInfo("Foolish Burial", "MAIN", 1));
        cards.add(new DeckCardInfo("One for One", "MAIN", 1));
        cards.add(new DeckCardInfo("Allure of Darkness", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new DeckCardInfo("Magical Android", "EXTRA", 2));
        cards.add(new DeckCardInfo("Colossal Fighter", "EXTRA", 2));
        cards.add(new DeckCardInfo("Mist Wurm", "EXTRA", 1));
        cards.add(new DeckCardInfo("Gaia Knight, the Force of Earth", "EXTRA", 2));
        seedDeck("Frog Monarch", "Classic tribute deck abusing Treeborn Frog.", "Edison", user, cards);
    }

    private void seedVayuTurboDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Blackwing - Vayu the Emblem of Honor", "MAIN", 3));
        cards.add(new DeckCardInfo("Blackwing - Sirocco the Dawn", "MAIN", 3));
        cards.add(new DeckCardInfo("Blackwing - Gale the Whirlwind", "MAIN", 1));
        cards.add(new DeckCardInfo("Blackwing - Elphin the Raven", "MAIN", 1));
        cards.add(new DeckCardInfo("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new DeckCardInfo("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new DeckCardInfo("Armageddon Knight", "MAIN", 2));
        cards.add(new DeckCardInfo("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new DeckCardInfo("Dark Armed Dragon", "MAIN", 1));
        cards.add(new DeckCardInfo("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new DeckCardInfo("Chaos Sorcerer", "MAIN", 1));
        cards.add(new DeckCardInfo("Blackwing - Bora the Spear", "MAIN", 1));
        cards.add(new DeckCardInfo("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new DeckCardInfo("Solar Recharge", "MAIN", 2));
        cards.add(new DeckCardInfo("Book of Moon", "MAIN", 3));
        cards.add(new DeckCardInfo("Allure of Darkness", "MAIN", 1));
        cards.add(new DeckCardInfo("Foolish Burial", "MAIN", 1));
        cards.add(new DeckCardInfo("Burial from a Different Dimension", "MAIN", 1));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        cards.add(new DeckCardInfo("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Icarus Attack", "MAIN", 3));
        cards.add(new DeckCardInfo("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new DeckCardInfo("Torrential Tribute", "MAIN", 1));
        cards.add(new DeckCardInfo("Solemn Judgment", "MAIN", 1));
        cards.add(new DeckCardInfo("Threatening Roar", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Blackwing Armed Wing", "EXTRA", 3));
        cards.add(new DeckCardInfo("Blackwing Armor Master", "EXTRA", 2));
        cards.add(new DeckCardInfo("Blackwing - Silverwind the Ascendant", "EXTRA", 1));
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 1));
        cards.add(new DeckCardInfo("Colossal Fighter", "EXTRA", 1));
        cards.add(new DeckCardInfo("Mist Wurm", "EXTRA", 1));
        seedDeck("Vayu Turbo", "Synchro summon from Graveyard using Vayu.", "Edison", user, cards);
    }

    private void seedDivaHeroDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Deep Sea Diva", "MAIN", 3));
        cards.add(new DeckCardInfo("Spiny Gillman", "MAIN", 2));
        cards.add(new DeckCardInfo("Elemental HERO Stratos", "MAIN", 1));
        cards.add(new DeckCardInfo("Destiny HERO - Malicious", "MAIN", 2));
        cards.add(new DeckCardInfo("Destiny HERO - Diamond Dude", "MAIN", 2));
        cards.add(new DeckCardInfo("Destiny HERO - Doom Lord", "MAIN", 1));
        cards.add(new DeckCardInfo("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new DeckCardInfo("Dark Armed Dragon", "MAIN", 1));
        cards.add(new DeckCardInfo("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new DeckCardInfo("Chaos Sorcerer", "MAIN", 1));
        cards.add(new DeckCardInfo("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new DeckCardInfo("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new DeckCardInfo("Miracle Fusion", "MAIN", 3));
        cards.add(new DeckCardInfo("E - Emergency Call", "MAIN", 1));
        cards.add(new DeckCardInfo("Reinforcement of the Army", "MAIN", 1));
        cards.add(new DeckCardInfo("Destiny Draw", "MAIN", 1));
        cards.add(new DeckCardInfo("Allure of Darkness", "MAIN", 1));
        cards.add(new DeckCardInfo("Foolish Burial", "MAIN", 1));
        cards.add(new DeckCardInfo("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new DeckCardInfo("Solar Recharge", "MAIN", 2));
        cards.add(new DeckCardInfo("Pot of Avarice", "MAIN", 2));
        cards.add(new DeckCardInfo("Book of Moon", "MAIN", 3));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        cards.add(new DeckCardInfo("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new DeckCardInfo("Torrential Tribute", "MAIN", 1));
        cards.add(new DeckCardInfo("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Elemental HERO Absolute Zero", "EXTRA", 3));
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new DeckCardInfo("Colossal Fighter", "EXTRA", 2));
        cards.add(new DeckCardInfo("Tempest Magician", "EXTRA", 1));
        cards.add(new DeckCardInfo("Mist Wurm", "EXTRA", 1));
        seedDeck("Diva Hero", "HERO deck leveraging Deep Sea Diva for Synchros and Fusions.", "Edison", user, cards);
    }

    private void seedLightswornDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Judgment Dragon", "MAIN", 2));
        cards.add(new DeckCardInfo("Lumina, Lightsworn Summoner", "MAIN", 3));
        cards.add(new DeckCardInfo("Garoth, Lightsworn Warrior", "MAIN", 2));
        cards.add(new DeckCardInfo("Wulf, Lightsworn Beast", "MAIN", 2));
        cards.add(new DeckCardInfo("Celestia, Lightsworn Angel", "MAIN", 2));
        cards.add(new DeckCardInfo("Lyla, Lightsworn Sorceress", "MAIN", 3));
        cards.add(new DeckCardInfo("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new DeckCardInfo("Ehren, Lightsworn Monk", "MAIN", 1));
        cards.add(new DeckCardInfo("Honest", "MAIN", 2));
        cards.add(new DeckCardInfo("Necro Gardna", "MAIN", 2));
        cards.add(new DeckCardInfo("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new DeckCardInfo("Chaos Sorcerer", "MAIN", 1));
        cards.add(new DeckCardInfo("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new DeckCardInfo("Solar Recharge", "MAIN", 3));
        cards.add(new DeckCardInfo("Monster Reincarnation", "MAIN", 2));
        cards.add(new DeckCardInfo("Beckoning Light", "MAIN", 2));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        cards.add(new DeckCardInfo("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Torrential Tribute", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new DeckCardInfo("Colossal Fighter", "EXTRA", 2));
        seedDeck("Lightsworn", "Milling strategy using Lightsworn monsters to summon Judgment Dragon.", "Edison", user,
                cards);
    }

    private void seedQuickdrawDandywarriorDeck(User user) {
        List<DeckCardInfo> cards = new ArrayList<>();
        cards.add(new DeckCardInfo("Quickdraw Synchron", "MAIN", 3));
        cards.add(new DeckCardInfo("Dandylion", "MAIN", 2));
        cards.add(new DeckCardInfo("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new DeckCardInfo("Super-Nimble Mega Hamster", "MAIN", 2));
        cards.add(new DeckCardInfo("Debris Dragon", "MAIN", 2));
        cards.add(new DeckCardInfo("Spore", "MAIN", 1));
        cards.add(new DeckCardInfo("Lonefire Blossom", "MAIN", 2));
        cards.add(new DeckCardInfo("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new DeckCardInfo("Sangan", "MAIN", 1));
        cards.add(new DeckCardInfo("Card Trooper", "MAIN", 1));
        cards.add(new DeckCardInfo("Tytannial, Princess of Camellias", "MAIN", 1));
        cards.add(new DeckCardInfo("Pot of Avarice", "MAIN", 3));
        cards.add(new DeckCardInfo("Book of Moon", "MAIN", 3));
        cards.add(new DeckCardInfo("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new DeckCardInfo("Foolish Burial", "MAIN", 1));
        cards.add(new DeckCardInfo("One for One", "MAIN", 1));
        cards.add(new DeckCardInfo("Heavy Storm", "MAIN", 1));
        cards.add(new DeckCardInfo("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new DeckCardInfo("Brain Control", "MAIN", 1));
        cards.add(new DeckCardInfo("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new DeckCardInfo("Torrential Tribute", "MAIN", 1));
        cards.add(new DeckCardInfo("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new DeckCardInfo("Drill Warrior", "EXTRA", 3));
        cards.add(new DeckCardInfo("Junk Destroyer", "EXTRA", 2));
        cards.add(new DeckCardInfo("Stardust Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Black Rose Dragon", "EXTRA", 2));
        cards.add(new DeckCardInfo("Goyo Guardian", "EXTRA", 1));
        cards.add(new DeckCardInfo("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new DeckCardInfo("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new DeckCardInfo("Colossal Fighter", "EXTRA", 2));
        seedDeck("Quickdraw Dandywarrior", "Synchro deck utilizing Dandylion tokens and Quickdraw Synchron.", "Edison",
                user, cards);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private void seedDeck(String name, String description, String formatName, User user, List<DeckCardInfo> cardInfos) {
        deckRepository.findByUser(user).stream()
                .filter(d -> d.getName().equalsIgnoreCase(name))
                .forEach(d -> deckRepository.delete(d));

        Deck deck = new Deck(name, description, formatName, user);
        List<DeckCard> deckCards = new ArrayList<>();
        for (DeckCardInfo info : cardInfos) {
            Optional<Card> cardOpt = cardRepository.findByName(info.cardName);
            if (cardOpt.isPresent()) {
                deckCards.add(new DeckCard(deck, cardOpt.get(), info.section, info.quantity));
            } else {
                logger.warn("Card '{}' not found in database. Skipping for deck '{}'.", info.cardName, name);
            }
        }
        deck.setDeckCards(deckCards);
        deckRepository.save(deck);
    }

    private static class DeckCardInfo {
        String cardName;
        String section;
        int quantity;

        DeckCardInfo(String cardName, String section, int quantity) {
            this.cardName = cardName;
            this.section = section;
            this.quantity = quantity;
        }
    }

    private void seedUser(String username, String password, String email) {
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isEmpty()) {
            User user = new User(username, passwordEncoder.encode(password), email);
            userRepository.save(user);
        }
    }
}
