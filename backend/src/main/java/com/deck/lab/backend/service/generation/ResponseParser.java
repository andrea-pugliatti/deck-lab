package com.deck.lab.backend.service.generation;

import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.CardSuggestionsAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerateAiResponseDto;

/**
 * Pure parsing component that converts string responses from AI into structured objects.
 */
@Component
public class ResponseParser {

    public DeckGenerateAiResponseDto parseGenerationResponse(String rawResponse) {
        BeanOutputConverter<DeckGenerateAiResponseDto> converter = new BeanOutputConverter<>(
                DeckGenerateAiResponseDto.class);
        return converter.convert(rawResponse);
    }

    public CardSuggestionsAiResponseDto parseSuggestionResponse(String rawResponse) {
        BeanOutputConverter<CardSuggestionsAiResponseDto> converter = new BeanOutputConverter<>(
                CardSuggestionsAiResponseDto.class);
        return converter.convert(rawResponse);
    }
}
