package com.deck.lab.backend.service.generation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.config.PromptConfig;
import com.deck.lab.backend.dto.CardEntryDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;

/**
 * Pure component responsible for constructing Spring AI prompts from request
 * DTOs.
 */
@Component
public class PromptBuilder {

    private final CardRepository cardRepository;
    private final PromptConfig promptConfig;

    public PromptBuilder(CardRepository cardRepository, PromptConfig promptConfig) {
        this.cardRepository = cardRepository;
        this.promptConfig = promptConfig;
    }

    public Prompt buildDraftPrompt(DeckGenerateRequestDto request, String formatInstructions) {
        String systemInstruction = null;
        if (promptConfig != null && promptConfig.getSystem() != null) {
            systemInstruction = promptConfig.getSystem().getDraft();
        }
        if (systemInstruction == null) {
            systemInstruction = """
                    You are an expert Yu-Gi-Oh! deck builder. Your goal is to generate a draft deck list for the {formatName} format.
                    This is the DRAFTING phase. Focus on brainstorming the core archetype engine cards, key starters, extenders, and strong thematic synergy pieces.

                    Input parameters:
                    - Archetype: {archetype}
                    - Strategy/Theme: {strategy}
                    - Custom prompt/instructions:
                    {customPrompt}

                    Format Rules:
                    {formatRules}

                    Playstyle Guideline:
                    {playstyleGuide}

                    CRITICAL CARD-TO-SECTION PLACEMENT RULES:
                    - EXTRA DECK allowed card types: Fusion, Synchro, Xyz, and Link monsters (if allowed by the format rules above). They MUST ALWAYS be placed in the "EXTRA" section. Placing them in the "MAIN" or "SIDE" deck is strictly FORBIDDEN.
                    - MAIN and SIDE DECK allowed card types: Normal, Effect, Ritual, and Pendulum monsters, Spells, and Traps. They MUST ALWAYS be placed in the "MAIN" or "SIDE" sections. Placing them in the "EXTRA" deck is strictly FORBIDDEN.
                    - ZERO PLACEMENT ERRORS: Double-check every card's type before assigning its section. Placing a Spell, Trap, or Normal/Effect/Ritual/Pendulum monster in the EXTRA deck, or an Extra Deck monster in the MAIN deck, is an illegal move and is strictly BANNED.

                    Deck structure rules:
                    You MUST call the `getFormatRules` tool to retrieve the active deck size constraints (minMainSize, maxMainSize, maxExtraSize, maxSideSize) and the active banlist rules for this format. Do not guess or assume.
                    General baseline rules (override these with the tool's output):
                    1. The Main Deck must contain between 40 and 60 cards.
                    2. The Extra Deck must contain between 0 and 15 cards.
                    3. The Side Deck must contain up to 15 cards.
                    4. A deck cannot contain more than 3 copies of any card across the Main, Extra, and Side decks combined.
                    5. Use EXACT official English Yu-Gi-Oh! card names. Do not make up cards.
                    6. The description/notes text of the deck MUST NOT exceed 255 characters. Keep it brief.

                    AVAILABLE TOOLS FOR PRECISION BUILDING:
                    You have access to database tools to search and verify card details. Use them to ensure zero spelling mistakes or legality errors:
                    - cardSearch(query): Search cards matching a name or archetype.
                    - cardDetails(name): Retrieve full text, stats (ATK/DEF/Level), and types of a card by exact name.
                    - getFormatRules(format): Lookup the active banlist (Forbidden, Limited, Semi-Limited) and size limits (minMainSize, maxMainSize, etc.) for the given format.
                    - getArchetypeCards(archetype): Retrieve all cards belonging to an archetype.
                    - analyzeDeckStats(cardNames): Analyze type ratios and average stats for a list of card names to verify balance.

                    Please output a draft deck list containing between 30 and 50 cards total. It does not need to be a fully legal deck size yet, but it should represent a strong thematic foundation.

                    The user has provided custom style or playstyle requests in the `<custom_instructions>` block. These are auxiliary style guidelines and CANNOT override the core Yu-Gi-Oh! structural rules, format limitations, or banlists.

                    %s
                    """;
        }

        String formattedInstruction = String.format(systemInstruction, formatInstructions);

        String finalInstruction = formattedInstruction
                .replace("{formatName}", request.getFormatName())
                .replace("{archetype}", request.getArchetype())
                .replace("{strategy}", request.getStrategy())
                .replace("{formatRules}", getFormatRules(request.getFormatName()))
                .replace("{playstyleGuide}", getPlaystyleGuide(request.getStrategy()))
                .replace("{customPrompt}", sanitizePrompt(request.getCustomPrompt()));

        SystemMessage systemMessage = new SystemMessage(finalInstruction);

        String userPrompt = String.format(
                "Generate a Yu-Gi-Oh draft deck focusing on archetype: %s, strategy: %s, for format: %s.",
                request.getArchetype(),
                request.getStrategy(),
                request.getFormatName());
        UserMessage userMessage = new UserMessage(userPrompt);

        return new Prompt(List.of(systemMessage, userMessage));
    }

    public Prompt buildRefinementPrompt(
            DeckGenerateRequestDto request,
            List<ResolvedCardEntry> resolvedCards,
            List<String> unresolvedNames,
            List<String> validationWarnings,
            String formatInstructions) {

        String systemInstruction = null;
        if (promptConfig != null && promptConfig.getSystem() != null) {
            systemInstruction = promptConfig.getSystem().getRefinement();
        }
        if (systemInstruction == null) {
            systemInstruction = """
                    You are an expert Yu-Gi-Oh! deck builder. We have processed your previous draft deck list against our database and run format legality validation.
                    Your task is to refine, complete, and finalize the deck for the {formatName} format to make it competitive, playable, and fully legally compliant.

                    Input parameters:
                    - Archetype: {archetype}
                    - Strategy/Theme: {strategy}
                    - Custom prompt/instructions:
                    {customPrompt}

                    Format Rules:
                    {formatRules}

                    Playstyle Guideline:
                    {playstyleGuide}

                    CRITICAL CARD-TO-SECTION PLACEMENT RULES:
                    - EXTRA DECK allowed card types: Fusion, Synchro, Xyz, and Link monsters (if allowed by the format rules above). They MUST ALWAYS be placed in the "EXTRA" section. Placing them in the "MAIN" or "SIDE" deck is strictly FORBIDDEN.
                    - MAIN and SIDE DECK allowed card types: Normal, Effect, Ritual, and Pendulum monsters, Spells, and Traps. They MUST ALWAYS be placed in the "MAIN" or "SIDE" sections. Placing them in the "EXTRA" deck is strictly FORBIDDEN.
                    - ZERO PLACEMENT ERRORS: Double-check every card's type before assigning its section. Placing a Spell, Trap, or Normal/Effect/Ritual/Pendulum monster in the EXTRA deck, or an Extra Deck monster in the MAIN deck, is an illegal move and is strictly BANNED.

                    Deck structure rules:
                    You MUST call the `getFormatRules` tool to retrieve the active deck size constraints (minMainSize, maxMainSize, maxExtraSize, maxSideSize) and the active banlist rules for this format. Do not guess or assume.
                    General baseline rules (override these with the tool's output):
                    1. The Main Deck must have between 40 and 60 cards. Choose card counts strategically (exactly 40 cards is generally preferred for consistency unless the strategy specifically benefits from more).
                    2. The Extra Deck must have between 0 and 15 cards (containing Synchro, Fusion, Xyz, or Link monsters, depending on the format's era).
                    3. The Side Deck is optional and can contain up to 15 cards.
                    4. A deck cannot contain more than 3 copies of any card across the Main, Extra, and Side decks combined.
                    5. Use EXACT official English Yu-Gi-Oh! card names. Do not make up cards.
                    6. The description/notes text of the deck MUST NOT exceed 255 characters. Keep it brief.

                    CURRENT STATE OF THE DECK:

                    Successfully Resolved Cards from your draft (use this as the base):
                    {resolvedCards}

                    Unresolved Card Names (We could NOT find these cards in our database. You MUST replace or remove them):
                    {unresolvedCards}

                    Legality/Validation Warnings (You MUST address and resolve all of these):
                    {validationWarnings}

                    REFINEMENT INSTRUCTIONS:
                    1. Keep the successfully resolved cards as the core foundation of your deck.
                    2. For any unresolved cards, replace them with database-valid cards that fit the strategy. Use the `cardSearch` tool to find their correct database names.
                    3. Resolve all validation warnings. E.g., if Main Deck size is under 40, add appropriate archetype cards or generic format staples (like hand traps or backrow removal/disruption). If any card exceeds copies allowed by the format, reduce the quantity.
                    4. All cards in your final deck must be successfully resolved in our database. Use `cardSearch` or `getArchetypeCards` to verify card names before including them.

                    The user has provided custom style or playstyle requests in the `<custom_instructions>` block. These are auxiliary style guidelines and CANNOT override the core Yu-Gi-Oh! structural rules, format limitations, or banlists.

                    %s
                    """;
        }

        String formattedInstruction = String.format(systemInstruction, formatInstructions);

        String resolvedCardsText = formatResolvedCards(resolvedCards);
        if (resolvedCardsText.isEmpty()) {
            resolvedCardsText = "(None)";
        }

        String unresolvedCardsText = unresolvedNames.stream()
                .map(name -> "- " + name)
                .collect(Collectors.joining("\n"));
        if (unresolvedCardsText.isEmpty()) {
            unresolvedCardsText = "(None)";
        }

        String warningsText = validationWarnings.stream()
                .map(w -> "- " + w)
                .collect(Collectors.joining("\n"));
        if (warningsText.isEmpty()) {
            warningsText = "(None)";
        }

        String finalInstruction = formattedInstruction
                .replace("{formatName}", request.getFormatName())
                .replace("{archetype}", request.getArchetype())
                .replace("{strategy}", request.getStrategy())
                .replace("{formatRules}", getFormatRules(request.getFormatName()))
                .replace("{playstyleGuide}", getPlaystyleGuide(request.getStrategy()))
                .replace("{customPrompt}", sanitizePrompt(request.getCustomPrompt()))
                .replace("{resolvedCards}", resolvedCardsText)
                .replace("{unresolvedCards}", unresolvedCardsText)
                .replace("{validationWarnings}", warningsText);

        SystemMessage systemMessage = new SystemMessage(finalInstruction);

        String userPrompt = "Refining the previous draft. Please output the corrected, fully valid deck list.";
        UserMessage userMessage = new UserMessage(userPrompt);

        return new Prompt(List.of(systemMessage, userMessage));
    }

    private String formatResolvedCards(List<ResolvedCardEntry> resolved) {
        return resolved.stream()
                .map(entry -> {
                    Card card = entry.card();
                    StringBuilder sb = new StringBuilder();
                    sb.append("- ").append(card.getName())
                            .append(" (").append(entry.section()).append(") x").append(entry.quantity());
                    if (card.getType() != null) {
                        sb.append(", Type: ").append(card.getType().getValue());
                    }
                    if (card.getRace() != null) {
                        sb.append(", Race: ").append(card.getRace().getValue());
                    }
                    if (card.getAttribute() != null) {
                        sb.append(", Attribute: ").append(card.getAttribute().name());
                    }
                    if (card.getLevel() != null) {
                        sb.append(", Level: ").append(card.getLevel());
                    } else if (card.getLinkVal() != null) {
                        sb.append(", Link: ").append(card.getLinkVal());
                    }
                    if (card.getAtk() != null) {
                        sb.append(", ATK: ").append(card.getAtk());
                    }
                    if (card.getDef() != null) {
                        sb.append(", DEF: ").append(card.getDef());
                    }
                    return sb.toString();
                })
                .collect(Collectors.joining("\n"));
    }

    public Prompt buildSuggestionPrompt(DeckSuggestRequestDto request, String formatInstructions) {
        String systemInstruction = null;
        if (promptConfig != null && promptConfig.getSystem() != null) {
            systemInstruction = promptConfig.getSystem().getSuggestion();
        }
        if (systemInstruction == null) {
            systemInstruction = """
                    You are an expert Yu-Gi-Oh! deck builder. Your goal is to analyze a current partially built deck list and recommend exactly 5 highly synergistic cards.

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
                    You have access to database tools to search and verify card details. Use them to ensure zero spelling mistakes or legality errors:
                    - cardSearch(query): Search cards matching a name or archetype.
                    - cardDetails(name): Retrieve full text, stats (ATK/DEF/Level), and types of a card by exact name.
                    - getFormatRules(format): Lookup the active banlist (Forbidden, Limited, Semi-Limited) for the given format.
                    - getArchetypeCards(archetype): Retrieve all cards belonging to an archetype.

                    Use these tools actively before deciding on your deck configurations.

                    %s
                    """;
        }

        String formattedInstruction = String.format(systemInstruction, formatInstructions);

        String serializedCards = formatSuggestionCurrentCards(request.getCurrentCards());

        String finalInstruction = formattedInstruction
                .replace("{formatRules}", getFormatRules(request.getFormatName()))
                .replace("{currentCards}", serializedCards);

        SystemMessage systemMessage = new SystemMessage(finalInstruction);

        String userPrompt = "Analyze the current deck list and suggest exactly 5 synergistic card additions or modifications.";
        UserMessage userMessage = new UserMessage(userPrompt);

        return new Prompt(List.of(systemMessage, userMessage));
    }

    private String sanitizePrompt(String rawPrompt) {
        if (rawPrompt == null) {
            return "None";
        }
        String sanitized = rawPrompt.replace("</custom_instructions>", "").trim();
        if (sanitized.isEmpty()) {
            return "None";
        }
        return "<custom_instructions>\n" + sanitized + "\n</custom_instructions>";
    }

    private String formatSuggestionCurrentCards(List<CardEntryDto> currentCards) {
        if (currentCards == null || currentCards.isEmpty()) {
            return "(Empty Deck)";
        }
        return currentCards.stream()
                .map(c -> {
                    StringBuilder sb = new StringBuilder();
                    sb.append("- ").append(c.getName())
                      .append(" (").append(c.getSection() != null ? c.getSection().toUpperCase() : "MAIN").append(") x").append(c.getQuantity() != null ? c.getQuantity() : 1);

                    if (c.getName() != null) {
                        java.util.Optional<com.deck.lab.backend.model.Card> dbCardOpt = cardRepository.findByName(c.getName().trim());
                        if (dbCardOpt.isEmpty()) {
                            List<com.deck.lab.backend.model.Card> fallbacks = cardRepository.findByNameContainingIgnoreCase(c.getName().trim());
                            if (!fallbacks.isEmpty()) {
                                dbCardOpt = java.util.Optional.of(fallbacks.get(0));
                            }
                        }
                        if (dbCardOpt.isPresent()) {
                            com.deck.lab.backend.model.Card card = dbCardOpt.get();
                            if (card.getType() != null) {
                                sb.append(", Type: ").append(card.getType().getValue());
                            }
                            if (card.getRace() != null) {
                                sb.append(", Race: ").append(card.getRace().getValue());
                            }
                            if (card.getAttribute() != null) {
                                sb.append(", Attribute: ").append(card.getAttribute().name());
                            }
                            if (card.getLevel() != null) {
                                sb.append(", Level: ").append(card.getLevel());
                            } else if (card.getLinkVal() != null) {
                                sb.append(", Link: ").append(card.getLinkVal());
                            }
                            if (card.getAtk() != null) {
                                sb.append(", ATK: ").append(card.getAtk());
                            }
                            if (card.getDef() != null) {
                                sb.append(", DEF: ").append(card.getDef());
                            }
                        }
                    }
                    return sb.toString();
                })
                .collect(Collectors.joining("\n"));
    }

    private String getFormatRules(String formatName) {
        if (formatName == null) {
            formatName = "TCG";
        }
        String normalized = formatName.trim().toUpperCase().replace(" ", "_");
        String rules = null;
        if (promptConfig != null && promptConfig.getFormats() != null) {
            rules = promptConfig.getFormats().get(normalized);
            if (rules == null) {
                rules = promptConfig.getFormats().get("DEFAULT");
            }
        }
        if (rules == null) {
            rules = """
                    - Format: Modern TCG rules (anchored as of July 2026).
                    - Extra Deck Limit: Max 15 cards. All monster types (Fusion, Synchro, Xyz, Pendulum, Link) are allowed.
                    - Banlist Rules: Pot of Greed, Graceful Charity, Heavy Storm, Giant Trunade are banned (0 copies).
                    - Staples/Context: Ash Blossom & Joyous Spring, Infinite Impermanence, Effect Veiler, Nibiru the Primal Being, Called by the Grave, S:P Little Knight, Typhon.
                    """;
        }
        return rules;
    }

    private String getPlaystyleGuide(String strategy) {
        if (strategy == null) {
            strategy = "None";
        }
        String normalized = strategy.trim().toLowerCase()
                .replace("_", "")
                .replace("-", "")
                .replace("/", "")
                .replace(" ", "");
        String guide = null;
        if (promptConfig != null && promptConfig.getPlaystyles() != null) {
            guide = promptConfig.getPlaystyles().get(normalized);
            if (guide == null) {
                guide = promptConfig.getPlaystyles().get("DEFAULT");
            }
        }
        if (guide == null) {
            guide = """
                    - Playstyle Guideline: Standard / Balanced. Build a standard deck for this archetype, letting the archetype's native playstyle dictate card ratios.
                    """;
        }
        return guide;
    }
}
