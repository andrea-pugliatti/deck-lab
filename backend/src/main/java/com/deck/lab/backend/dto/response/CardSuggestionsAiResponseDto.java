package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

public class CardSuggestionsAiResponseDto {
    private List<CardSuggestionDto> suggestions = new ArrayList<>();

    public CardSuggestionsAiResponseDto() {
    }

    public CardSuggestionsAiResponseDto(List<CardSuggestionDto> suggestions) {
        this.suggestions = suggestions;
    }

    public List<CardSuggestionDto> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<CardSuggestionDto> suggestions) {
        this.suggestions = suggestions;
    }
}
