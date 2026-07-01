package com.deck.lab.backend.service.generation;

import java.util.List;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

/**
 * Service serving as a thin wrapper around Spring AI ChatModel, configuring tool calls.
 */
@Service
public class AiClient {

    private final ChatModel chatModel;
    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;

    public AiClient(ChatModel chatModel, CardRepository cardRepository, FormatRulesRepository formatRulesRepository) {
        this.chatModel = chatModel;
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
    }

    /**
     * Executes the LLM prompt with the registered database search and details tools.
     *
     * @param prompt the prompt to send
     * @return the raw output string from the AI
     */
    public String call(Prompt prompt) {
        var cardSearchTool = FunctionToolCallback.builder("cardSearch", new CardSearchTool(cardRepository))
                .description("Search for Yu-Gi-Oh! cards in the local database by name or archetype. Returns a list of matching card names, types, and archetypes.")
                .inputType(CardSearchTool.CardSearchRequest.class)
                .build();

        var cardDetailsTool = FunctionToolCallback.builder("cardDetails", new CardDetailsTool(cardRepository))
                .description("Retrieve full card parameters (effect description, ATK, DEF, Level, etc.) by exact name.")
                .inputType(CardDetailsTool.CardDetailsRequest.class)
                .build();

        var formatRulesTool = FunctionToolCallback.builder("getFormatRules", new GetFormatRulesTool(formatRulesRepository))
                .description("Retrieve the banlist of restricted cards and their limit status (FORBIDDEN, LIMITED, SEMI_LIMITED) for a given format (e.g. GOAT, EDISON).")
                .inputType(GetFormatRulesTool.FormatRulesRequest.class)
                .build();

        var getArchetypeCardsTool = FunctionToolCallback.builder("getArchetypeCards", new GetArchetypeCardsTool(cardRepository))
                .description("Query all cards matching a specific archetype from the database. Returns a list of card names, types, and attributes.")
                .inputType(GetArchetypeCardsTool.ArchetypeCardsRequest.class)
                .build();

        var analyzeDeckStatsTool = FunctionToolCallback.builder("analyzeDeckStats", new AnalyzeDeckStatsTool(cardRepository))
                .description("Analyze type ratios, averages, attribute and archetype spreads of a list of card names.")
                .inputType(AnalyzeDeckStatsTool.DeckStatsRequest.class)
                .build();

        GoogleGenAiChatOptions options = GoogleGenAiChatOptions.builder()
                .toolCallbacks(List.of(
                        cardSearchTool,
                        cardDetailsTool,
                        formatRulesTool,
                        getArchetypeCardsTool,
                        analyzeDeckStatsTool
                ))
                .build();

        Prompt promptWithTools = new Prompt(prompt.getInstructions(), options);
        var response = chatModel.call(promptWithTools);
        return response.getResult().getOutput().getText();
    }
}
