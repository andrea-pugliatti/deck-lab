package com.deck.lab.backend.service;

import java.util.List;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionsAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerateAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.service.generation.AiClient;
import com.deck.lab.backend.service.generation.CardResolver;
import com.deck.lab.backend.service.generation.DeckAssembler;
import com.deck.lab.backend.service.generation.PromptBuilder;
import com.deck.lab.backend.service.generation.ResponseParser;
import com.deck.lab.backend.service.generation.ValidationAdapter;

/**
 * Service managing AI-driven deck generation and card synergy recommendations.
 * Orchestrates calls using the deep AI generation sub-modules.
 */
@Service
public class GenerationService {

        private final PromptBuilder promptBuilder;
        private final AiClient aiClient;
        private final ResponseParser responseParser;
        private final CardResolver cardResolver;
        private final DeckAssembler deckAssembler;
        private final ValidationAdapter validationAdapter;

        public GenerationService(PromptBuilder promptBuilder,
                        AiClient aiClient,
                        ResponseParser responseParser,
                        CardResolver cardResolver,
                        DeckAssembler deckAssembler,
                        ValidationAdapter validationAdapter) {
                this.promptBuilder = promptBuilder;
                this.aiClient = aiClient;
                this.responseParser = responseParser;
                this.cardResolver = cardResolver;
                this.deckAssembler = deckAssembler;
                this.validationAdapter = validationAdapter;
        }

        /**
         * Generates a complete deck list using LLM prompt templates and validates
         * output against local card databases and format legality rules.
         *
         * @param request the DTO parameters specifying archetype, strategy, and format
         *                rules
         * @return the generated deck list and any compliance validation warning strings
         */
        @Transactional(readOnly = true)
        public DeckGenerationResponseDto generateDeck(DeckGenerateRequestDto request) {
                BeanOutputConverter<DeckGenerateAiResponseDto> converter = new BeanOutputConverter<>(
                                DeckGenerateAiResponseDto.class);

                Prompt prompt = promptBuilder.buildGenerationPrompt(request, converter.getFormat());
                String responseContent = aiClient.call(prompt);
                DeckGenerateAiResponseDto aiDeck = responseParser.parseGenerationResponse(responseContent);

                List<CardResolver.ResolvedCardEntry> resolved = cardResolver.resolveCards(
                                aiDeck != null ? aiDeck.getCards() : List.of());

                String deckName = aiDeck != null && aiDeck.getName() != null && !aiDeck.getName().isBlank()
                                ? aiDeck.getName()
                                : request.getArchetype() + " Deck";

                Deck deck = deckAssembler.assembleDeck(deckName, request.getFormatName(), resolved);
                List<DeckCardDto> matchedCards = deckAssembler.toDeckCardDtos(resolved);

                List<String> warnings = validationAdapter.validate(deck);

                return new DeckGenerationResponseDto(
                                deckName,
                                aiDeck != null && aiDeck.getDescription() != null ? aiDeck.getDescription()
                                                : "AI generated deck.",
                                request.getFormatName(),
                                matchedCards,
                                warnings);
        }

        /**
         * Provides exactly 5 card recommendations that synergize with the current deck
         * list.
         *
         * @param request the DTO containing the current deck list and target format
         *                name
         * @return a list of 5 card suggestions with synergy rationales
         */
        @Transactional(readOnly = true)
        public List<CardSuggestionDto> suggestCards(DeckSuggestRequestDto request) {
                BeanOutputConverter<CardSuggestionsAiResponseDto> converter = new BeanOutputConverter<>(
                                CardSuggestionsAiResponseDto.class);

                Prompt prompt = promptBuilder.buildSuggestionPrompt(request, converter.getFormat());
                String responseContent = aiClient.call(prompt);
                CardSuggestionsAiResponseDto aiSuggestions = responseParser.parseSuggestionResponse(responseContent);

                return cardResolver.resolveSuggestions(
                                aiSuggestions != null
                                                ? aiSuggestions.getSuggestions()
                                                : List.of());
        }
}
