package com.deck.lab.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.CardEntryDto;
import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionsAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerateAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.validation.DeckValidationEngine;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Service managing AI-driven deck generation and card synergy recommendations.
 *
 * <p><strong>Design Pattern: Service Layer (AI Integration & Prompt Orchestrator)</strong></p>
 * <p>This service coordinates interactions with Large Language Models (LLMs) to generate deck configurations.
 * It encapsulates prompt construction, system instructions, structured output serialization, and database mapping logic.</p>
 *
 * <p><strong>Spring AI & Structured Output Concepts:</strong></p>
 * <ul>
 *   <li>{@code ChatModel} Abstraction: Instead of direct vendor API bindings (like OpenAI or Anthropic SDKs), this service
 *   injects Spring AI's generic {@link ChatModel}. This provides vendor independence, allowing the underlying LLM provider
 *   to be swapped out via simple configuration updates without altering source code.</li>
 *   <li>Prompt Structuring: Combines a {@link SystemMessage} (defining AI personas and output guidelines) and a
 *   {@link UserMessage} (conveying the user's specific strategy request).</li>
 *   <li>{@link BeanOutputConverter}: Enforces structured outputs (JSON) from the LLM. It generates format instructions
 *   for the prompt and maps the raw response back into strongly typed Java DTOs (e.g. {@link DeckGenerateAiResponseDto}),
 *   minimizing parsing errors.</li>
 * </ul>
 *
 * <p><strong>Database Resolution & Verification Pipeline:</strong></p>
 * <p>LLMs are prone to hallucinations or formatting errors. The service passes raw results through a verification pipeline:
 * fetching true card specifications from {@link CardRepository}, filtering out unrecognized entries, converting them to
 * domain entities, and invoking {@link DeckValidationEngine} to identify and flag rule warnings.</p>
 */
@Service
public class DeckGenerationService {

    private final ChatModel chatModel;
    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;
    private final DeckValidationEngine validationEngine;

    /**
     * Constructs a new DeckGenerationService.
     */
    public DeckGenerationService(ChatModel chatModel,
            CardRepository cardRepository,
            FormatRulesRepository formatRulesRepository,
            DeckValidationEngine validationEngine) {
        this.chatModel = chatModel;
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
        this.validationEngine = validationEngine;
    }

    /**
     * Generates a complete deck list using LLM prompt templates and validates output
     * against local card databases and format legality rules.
     *
     * @param request the DTO parameters specifying archetype, strategy, and format rules
     * @return the generated deck list and any compliance validation warning strings
     */
    @Transactional(readOnly = true)
    public DeckGenerationResponseDto generateDeck(DeckGenerateRequestDto request) {
        BeanOutputConverter<DeckGenerateAiResponseDto> converter = new BeanOutputConverter<>(
                DeckGenerateAiResponseDto.class);

        String systemInstruction = """
                You are an expert Yu-Gi-Oh! deck builder. Your goal is to generate a competitive, playable, and legally compliant deck for the {formatName} format.

                Input parameters:
                - Archetype: {archetype}
                - Strategy/Theme: {strategy}
                - Custom prompt/instructions: {customPrompt}

                Format Rules:
                {formatRules}

                Playstyle Guideline:
                {playstyleGuide}

                CRITICAL CARD-TO-SECTION PLACEMENT RULES:
                - EXTRA DECK allowed card types: Fusion, Synchro, Xyz, and Link monsters (if allowed by the format rules above). They MUST ALWAYS be placed in the "EXTRA" section. Placing them in the "MAIN" or "SIDE" deck is strictly FORBIDDEN.
                - MAIN and SIDE DECK allowed card types: Normal, Effect, Ritual, and Pendulum monsters, Spells, and Traps. They MUST ALWAYS be placed in the "MAIN" or "SIDE" sections. Placing them in the "EXTRA" deck is strictly FORBIDDEN.
                - ZERO PLACEMENT ERRORS: Double-check every card's type before assigning its section. Placing a Spell, Trap, or Normal/Effect/Ritual/Pendulum monster in the EXTRA deck, or an Extra Deck monster in the MAIN deck, is an illegal move and is strictly BANNED.

                General Interaction Guidelines:
                - For retro formats (Goat, Edison, Tengu Plant, HAT), prioritize setting spell and trap cards in the backrow for disruption.
                - For modern formats (TCG, OCG), prioritize hand traps that activate from the hand for fast interaction.

                Deck structure rules:
                1. The Main Deck must have between 40 and 60 cards. Choose card counts strategically (exactly 40 cards is generally preferred for consistency unless the strategy specifically benefits from more).
                2. The Extra Deck must have between 0 and 15 cards (containing Synchro, Fusion, Xyz, or Link monsters, depending on the format's era).
                3. The Side Deck is optional and can contain up to 15 cards.
                4. A deck cannot contain more than 3 copies of any card across the Main, Extra, and Side decks combined.
                5. Use EXACT official English Yu-Gi-Oh! card names. Do not make up cards.

                %s
                """;

        String formattedInstruction = String.format(systemInstruction, converter.getFormat());

        String finalInstruction = formattedInstruction
                .replace("{formatName}", request.getFormatName())
                .replace("{archetype}", request.getArchetype())
                .replace("{strategy}", request.getStrategy())
                .replace("{formatRules}", getFormatRules(request.getFormatName()))
                .replace("{playstyleGuide}", getPlaystyleGuide(request.getStrategy()))
                .replace("{customPrompt}", request.getCustomPrompt() != null ? request.getCustomPrompt() : "None");

        SystemMessage systemMessage = new SystemMessage(finalInstruction);

        String userPrompt = String.format(
                "Generate a legal %s format Yu-Gi-Oh deck focusing on archetype: %s and strategy: %s. %s",
                request.getFormatName(),
                request.getArchetype(),
                request.getStrategy(),
                request.getCustomPrompt() != null ? request.getCustomPrompt() : "");
        UserMessage userMessage = new UserMessage(userPrompt);

        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        var response = chatModel.call(prompt);
        String responseContent = response.getResult().getOutput().getText();

        DeckGenerateAiResponseDto aiDeck = converter.convert(responseContent);

        // Process generated cards and match them against local database
        List<DeckCardDto> matchedCards = new ArrayList<>();
        long tempIdCounter = 1;

        if (aiDeck != null && aiDeck.getCards() != null) {
            for (CardEntryDto entry : aiDeck.getCards()) {
                if (entry.getName() == null || entry.getName().isBlank()) {
                    continue;
                }
                Optional<Card> dbCardOpt = lookupCard(entry.getName());
                if (dbCardOpt.isPresent()) {
                    Card card = dbCardOpt.get();
                    String section = entry.getSection() != null ? entry.getSection().toUpperCase() : "MAIN";
                    if (!List.of("MAIN", "EXTRA", "SIDE").contains(section)) {
                        section = "MAIN";
                    }
                    Integer quantity = entry.getQuantity();
                    if (quantity == null || quantity < 1) {
                        quantity = 1;
                    } else if (quantity > 3) {
                        quantity = 3;
                    }

                    matchedCards.add(new DeckCardDto(
                            tempIdCounter++,
                            card.getId(),
                            card.getName(),
                            card.getType() != null ? card.getType().getValue() : null,
                            card.getDescription(),
                            card.getRace() != null ? card.getRace().getValue() : null,
                            card.getAttribute() != null ? card.getAttribute().getValue() : null,
                            card.getArchetype(),
                            card.getImageUrl(),
                            section,
                            quantity));
                }
            }
        }

        // Run validator engine
        List<String> warnings = runValidation(request.getFormatName(),
                aiDeck != null ? aiDeck.getName() : "Generated Deck", request.getFormatName(), matchedCards);

        return new DeckGenerationResponseDto(
                aiDeck != null && aiDeck.getName() != null && !aiDeck.getName().isBlank() ? aiDeck.getName()
                        : request.getArchetype() + " Deck",
                aiDeck != null && aiDeck.getDescription() != null ? aiDeck.getDescription() : "AI generated deck.",
                request.getFormatName(),
                matchedCards,
                warnings);
    }

    /**
     * Provides exactly 5 card recommendations that synergize with the current deck list.
     *
     * @param request the DTO containing the current deck list and target format name
     * @return a list of 5 card suggestions with synergy rationales
     */
    @Transactional(readOnly = true)
    public List<CardSuggestionDto> suggestCards(DeckSuggestRequestDto request) {
        BeanOutputConverter<CardSuggestionsAiResponseDto> converter = new BeanOutputConverter<>(
                CardSuggestionsAiResponseDto.class);

        String systemInstruction = """
                You are an expert Yu-Gi-Oh! deck builder. Your goal is to analyze a current partially built deck list and recommend exactly 5 highly synergistic cards.

                Format: {formatName}
                {formatRules}

                Current Deck List:
                {currentCards}

                Instructions:
                1. Recommend exactly 5 card suggestions.
                2. The suggestions must be highly synergistic or essential staples that would benefit this specific deck.
                3. Do not suggest cards that are already in the current deck.
                4. Enforce format legality (e.g. do not suggest forbidden/banned cards for the specified format).
                5. Provide the exact official English card name.
                6. Specify the suggested section ("MAIN", "EXTRA", or "SIDE").
                7. Write a brief, compelling synergy reason (1-2 sentences) explaining why this card fits.

                CRITICAL CARD-TO-SECTION PLACEMENT RULES:
                - EXTRA DECK allowed card types: Fusion, Synchro, Xyz, and Link monsters (if allowed by the format rules above). They MUST ALWAYS be placed in the "EXTRA" section. Placing them in the "MAIN" or "SIDE" deck is strictly FORBIDDEN.
                - MAIN and SIDE DECK allowed card types: Normal, Effect, Ritual, and Pendulum monsters, Spells, and Traps. They MUST ALWAYS be placed in the "MAIN" or "SIDE" sections. Placing them in the "EXTRA" deck is strictly FORBIDDEN.
                - ZERO PLACEMENT ERRORS: Double-check every card's type before assigning its section. Placing a Spell, Trap, or Normal/Effect/Ritual/Pendulum monster in the EXTRA deck, or an Extra Deck monster in the MAIN deck, is an illegal move and is strictly BANNED.

                General Interaction Guidelines:
                - For retro formats (Goat, Edison, Tengu Plant, HAT), prioritize setting spell and trap cards in the backrow for disruption.
                - For modern formats (TCG, OCG), prioritize hand traps that activate from the hand for fast interaction.

                %s
                """;

        String formattedInstruction = String.format(systemInstruction, converter.getFormat());

        String serializedCards = request.getCurrentCards().stream()
                .map(c -> String.format("- %s (%s) x%d", c.getName(), c.getSection(), c.getQuantity()))
                .collect(Collectors.joining("\n"));

        String finalInstruction = formattedInstruction
                .replace("{formatName}", request.getFormatName())
                .replace("{formatRules}", getFormatRules(request.getFormatName()))
                .replace("{currentCards}", serializedCards.isEmpty() ? "(Empty Deck)" : serializedCards);

        SystemMessage systemMessage = new SystemMessage(finalInstruction);

        String userPrompt = String.format("Analyze the current %s deck and recommend 5 cards.",
                request.getFormatName());
        UserMessage userMessage = new UserMessage(userPrompt);

        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        var response = chatModel.call(prompt);
        String responseContent = response.getResult().getOutput().getText();

        CardSuggestionsAiResponseDto aiSuggestions = converter.convert(responseContent);

        List<CardSuggestionDto> matchedSuggestions = new ArrayList<>();
        if (aiSuggestions != null && aiSuggestions.getSuggestions() != null) {
            for (CardSuggestionDto suggestion : aiSuggestions.getSuggestions()) {
                if (suggestion.getName() == null || suggestion.getName().isBlank()) {
                    continue;
                }
                Optional<Card> dbCardOpt = lookupCard(suggestion.getName());
                if (dbCardOpt.isPresent()) {
                    Card card = dbCardOpt.get();
                    matchedSuggestions.add(new CardSuggestionDto(
                            card.getName(),
                            suggestion.getSection() != null ? suggestion.getSection().toUpperCase() : "MAIN",
                            suggestion.getSynergyReason() != null ? suggestion.getSynergyReason()
                                    : "Provides good synergy.",
                            card.getId(),
                            card.getType() != null ? card.getType().getValue() : null,
                            card.getImageUrlCropped()));
                }
            }
        }

        return matchedSuggestions;
    }

    /**
     * Translates a format name to specific prompt instruction rules.
     */
    private String getFormatRules(String formatName) {
        if (formatName == null) {
            formatName = "TCG";
        }
        return switch (formatName.toUpperCase()) {
            case "GOAT" ->
                """
                        - Format Rules: Goat Format (2005). Only FUSION monsters are allowed in the Extra Deck. Synchro, Xyz, Pendulum, and Link monsters do not exist and are strictly FORBIDDEN.
                        - Extra Deck Limit: Size is unlimited (0 to 99 cards).
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity, Delinquent Duo, Snatch Steal, Heavy Storm, Premature Burial are limited to max 1 copy.
                        - Staples to consider: Torrential Tribute, Mirror Force, Ring of Destruction, Sakuretsu Armor, Mystical Space Typhoon, Dust Tornado.
                        """;
            case "EDISON" ->
                """
                        - Format Rules: Edison Format (2010). Only FUSION and SYNCHRO monsters are allowed in the Extra Deck. Xyz, Pendulum, and Link monsters do not exist and are strictly FORBIDDEN.
                        - Extra Deck Limit: Max 15 cards.
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity, Delinquent Duo are banned (0 copies). Heavy Storm, Brain Control, Mind Control are limited to max 1 copy.
                        - Staples to consider: Torrential Tribute, Mirror Force, Book of Moon, Bottomless Trap Hole, Mystical Space Typhoon.
                        """;
            case "TENGU PLANT", "TENGU_PLANT" ->
                """
                        - Format Rules: Tengu Plant Format (September 2011). Only FUSION and SYNCHRO monsters are allowed in the Extra Deck. Xyz, Pendulum, and Link monsters do not exist and are strictly FORBIDDEN.
                        - Extra Deck Limit: Max 15 cards.
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity, Delinquent Duo are banned (0 copies). Heavy Storm, Monster Reborn, Dark Hole are limited to max 1 copy.
                        - Staples to consider: Book of Moon, Mystical Space Typhoon, Solemn Warning, Solemn Judgment, Effect Veiler.
                        """;
            case "HAT" ->
                """
                        - Format Rules: HAT Format (2014). FUSION, SYNCHRO, and XYZ monsters are allowed in the Extra Deck. Pendulum and Link monsters do not exist and are strictly FORBIDDEN.
                        - Extra Deck Limit: Max 15 cards.
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity, Heavy Storm, Giant Trunade are banned (0 copies).
                        - Staples to consider: Mystical Space Typhoon, Solemn Warning, Torrential Tribute, Bottomless Trap Hole, Compulsory Evacuation Device, Fiendish Chain.
                        """;
            case "OCG" ->
                """
                        - Format Rules: Modern OCG rules. All monster types (Fusion, Synchro, Xyz, Pendulum, Link) are allowed.
                        - Extra Deck Limit: Max 15 cards.
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity are banned (0 copies).
                        - Staples to consider: Maxx "C", Ash Blossom & Joyous Spring, Infinite Impermanence, Called by the Grave, Crossout Designator.
                        """;
            default ->
                """
                        - Format Rules: Modern TCG rules. All monster types (Fusion, Synchro, Xyz, Pendulum, Link) are allowed.
                        - Extra Deck Limit: Max 15 cards.
                        - Forbidden/Limited Rules: Pot of Greed, Graceful Charity, Heavy Storm, Giant Trunade are banned (0 copies).
                        - Staples to consider: Ash Blossom & Joyous Spring, Infinite Impermanence, Effect Veiler, Called by the Grave, Nibiru the Primal Being.
                        """;
        };
    }

    /**
     * Translates a strategy style (e.g. combo, control) to specific prompt guide guidelines.
     */
    private String getPlaystyleGuide(String strategy) {
        if (strategy == null) {
            strategy = "None";
        }
        return switch (strategy.trim().toLowerCase()) {
            case "combo" ->
                """
                        - Playstyle Guideline: Combo / Synchro Spam. Prioritize monsters that act as starters or extenders. Focus on cards that chain special summons to build large boards. Keep trap cards to a minimum (0-4 copies) to maximize consistency.
                        """;
            case "control" ->
                """
                        - Playstyle Guideline: Control / Stun. Focus on counter-traps, hand traps, negations, and resource denial. Lower monster count is common, making room for solid defense and removal spells/traps.
                        """;
            case "aggro" ->
                """
                        - Playstyle Guideline: Aggro / OTK. Focus on high attack power, quick-play spells, and board wipes. Avoid slow trap cards, prioritizing speed and immediate offensive pressure to win quickly.
                        """;
            case "midrange" ->
                """
                        - Playstyle Guideline: Midrange / Balanced. Aim for a balanced split of core archetype monsters, search/draw spells, and a reliable lineup of traps or hand traps for disruption. Focus on resource loops and recovery.
                        """;
            case "going second", "going_second" ->
                """
                        - Playstyle Guideline: Going Second / Board Breaker. Include board-breaking cards (e.g. board wipes, spell/trap removal) and hand traps that can disrupt the opponent during their first turn. Avoid slow traps that require setting.
                        """;
            case "stall/burn", "stall_burn" ->
                """
                        - Playstyle Guideline: Stall / Burn. Focus on defensive walls, negations, stalling tactics (e.g. battle protection spells/traps), and LP burn damage cards.
                        """;
            case "pure" ->
                """
                        - Playstyle Guideline: Pure Archetype. Focus strictly on cards belonging directly to the chosen archetype, minimizing generic staples to keep the theme and deck engine pure.
                        """;
            default ->
                """
                        - Playstyle Guideline: Standard / Balanced. Build a standard deck for this archetype, letting the archetype's native playstyle dictate card ratios.
                        """;
        };
    }

    /**
     * Queries the local database to find a matching Card by exact name or substring fallback.
     */
    private Optional<Card> lookupCard(String name) {
        Optional<Card> cardOpt = cardRepository.findByName(name.trim());
        if (cardOpt.isEmpty()) {
            List<Card> fallbacks = cardRepository.findByNameContainingIgnoreCase(name.trim());
            if (!fallbacks.isEmpty()) {
                cardOpt = Optional.of(fallbacks.get(0));
            }
        }
        return cardOpt;
    }

    /**
     * Runs compliance validation on the generated deck list and compiles warning strings.
     */
    private List<String> runValidation(String deckName, String aiName, String formatName, List<DeckCardDto> cardDtos) {
        Deck deck = new Deck();
        deck.setName(aiName);
        Format format = null;
        try {
            format = Format.fromString(formatName);
            deck.setFormatName(format);
        } catch (IllegalArgumentException e) {
            // Ignore invalid format
        }

        List<Long> cardIds = cardDtos.stream().map(card -> card.getCardId()).toList();
        List<Card> cards = cardRepository.findAllById(cardIds);
        Map<Long, Card> cardMap = cards.stream().collect(Collectors.toMap(c -> c.getId(), c -> c));

        List<DeckCard> deckCards = new ArrayList<>();
        for (DeckCardDto cardDto : cardDtos) {
            Card card = cardMap.get(cardDto.getCardId());
            if (card != null) {
                DeckSection sectionEnum = null;
                try {
                    sectionEnum = cardDto.getSection() != null ? DeckSection.fromString(cardDto.getSection()) : null;
                } catch (IllegalArgumentException e) {
                    // Ignore invalid section
                }
                deckCards.add(new DeckCard(deck, card, sectionEnum, cardDto.getQuantity()));
            }
        }
        deck.setDeckCards(deckCards);

        Map<Long, CardStatus> formatLimits = new HashMap<>();
        if (format != null) {
            List<FormatRules> formatRules = formatRulesRepository.findByFormatName(format);
            for (FormatRules rule : formatRules) {
                if (rule.getCard() != null) {
                    formatLimits.put(rule.getCard().getId(), rule.getStatus());
                }
            }
        }

        List<ValidationError> errors = validationEngine.validate(deck, formatLimits);
        return errors.stream().map(error -> error.message()).collect(Collectors.toList());
    }
}
