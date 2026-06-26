package com.deck.lab.backend.config;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.google.api.client.util.Value;

@Component
public class BanlistImporter {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);
    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;

    private final TransactionTemplate transactionTemplate;
    private final RestClient restClient;

    @Value("${app.ygoprodeck.api-url:https://db.ygoprodeck.com/api/v7/cardinfo.php}")
    private String apiUrl;

    public BanlistImporter(CardRepository cardRepository,
            FormatRulesRepository formatRulesRepository,
            PlatformTransactionManager transactionManager) {
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.restClient = RestClient.create();
    }

    public void seedBanlistsFromApi() {
        logger.info("Seeding banlists from YGOProDeck API...");

        Map<String, String> apiFormatMapping = Map.of(
                "tcg", "TCG",
                "ocg", "OCG",
                "goat", "Goat");

        for (Map.Entry<String, String> entry : apiFormatMapping.entrySet()) {
            String apiFormat = entry.getKey();
            String localFormat = entry.getValue();

            try {
                Format formatEnum = Format.fromString(localFormat);
                List<FormatRules> existingRules = formatRulesRepository.findByFormatName(formatEnum);
                if (!existingRules.isEmpty()) {
                    logger.info("Banlist for {} already seeded ({} rules). Skipping.", localFormat,
                            existingRules.size());
                    continue;
                }

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

                    toSave.add(new FormatRules(formatEnum, card, status));

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

    public void seedHistoricalBanlists() {
        seedHistoricalFormatIfEmpty("Edison", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.FORBIDDEN,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));

        seedHistoricalFormatIfEmpty("Tengu Plant", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.LIMITED,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));

        seedHistoricalFormatIfEmpty("HAT Format", Map.of(
                "Pot of Greed", CardStatus.FORBIDDEN,
                "Graceful Charity", CardStatus.FORBIDDEN,
                "Delinquent Duo", CardStatus.FORBIDDEN,
                "Monster Reborn", CardStatus.FORBIDDEN,
                "Raigeki", CardStatus.FORBIDDEN,
                "Exodia the Forbidden One", CardStatus.LIMITED));
    }

    private void seedHistoricalFormatIfEmpty(String formatName, Map<String, CardStatus> rules) {
        Format formatEnum = null;
        try {
            formatEnum = Format.fromString(formatName);
        } catch (IllegalArgumentException e) {
            logger.error("Failed to parse historical format name: {}", formatName);
            return;
        }

        List<FormatRules> existing = formatRulesRepository.findByFormatName(formatEnum);
        if (!existing.isEmpty()) {
            logger.info("Historical banlist for {} already seeded. Skipping.", formatName);
            return;
        }

        int seeded = 0;
        for (Map.Entry<String, CardStatus> entry : rules.entrySet()) {
            Optional<Card> cardOpt = cardRepository.findByName(entry.getKey());
            if (cardOpt.isPresent()) {
                formatRulesRepository.save(new FormatRules(formatEnum, cardOpt.get(), entry.getValue()));
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

}
