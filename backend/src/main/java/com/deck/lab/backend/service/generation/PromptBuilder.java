package com.deck.lab.backend.service.generation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;

/**
 * Pure component responsible for constructing Spring AI prompts from request DTOs.
 */
@Component
public class PromptBuilder {

    public Prompt buildGenerationPrompt(DeckGenerateRequestDto request, String formatInstructions) {
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

                AVAILABLE TOOLS FOR PRECISION BUILDING:
                You have access to several database tools to search and verify card details. Use them to ensure zero spelling mistakes or legality errors:
                - cardSearch(query): Search cards matching a name or archetype.
                - cardDetails(name): Retrieve full text, stats (ATK/DEF/Level), and types of a card by exact name.
                - getFormatRules(format): Lookup the active banlist (Forbidden, Limited, Semi-Limited) for the given format.
                - getArchetypeCards(archetype): Retrieve all cards belonging to an archetype.
                - analyzeDeckStats(cardNames): Analyze type ratios and average stats for a list of card names to verify balance.

                Use these tools actively before deciding on your deck configurations.

                %s
                """;

        String formattedInstruction = String.format(systemInstruction, formatInstructions);

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

        return new Prompt(List.of(systemMessage, userMessage));
    }

    public Prompt buildSuggestionPrompt(DeckSuggestRequestDto request, String formatInstructions) {
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

                AVAILABLE TOOLS FOR PRECISION BUILDING:
                You have access to several database tools to search and verify card details. Use them to ensure zero spelling mistakes or legality errors:
                - cardSearch(query): Search cards matching a name or archetype.
                - cardDetails(name): Retrieve full text, stats (ATK/DEF/Level), and types of a card by exact name.
                - getFormatRules(format): Lookup the active banlist (Forbidden, Limited, Semi-Limited) for the given format.
                - getArchetypeCards(archetype): Retrieve all cards belonging to an archetype.
                - analyzeDeckStats(cardNames): Analyze type ratios and average stats for a list of card names to verify balance.

                Use these tools actively before deciding on your deck configurations.

                %s
                """;

        String formattedInstruction = String.format(systemInstruction, formatInstructions);

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

        return new Prompt(List.of(systemMessage, userMessage));
    }

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
}
