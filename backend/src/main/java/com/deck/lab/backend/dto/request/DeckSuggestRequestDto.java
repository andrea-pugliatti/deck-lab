package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class DeckSuggestRequestDto {
    @NotBlank(message = "Format name is required")
    private String formatName;

    @NotNull(message = "Current cards list is required")
    private List<DeckCardItemDto> currentCards = new ArrayList<>();

    public DeckSuggestRequestDto() {
    }

    public DeckSuggestRequestDto(String formatName, List<DeckCardItemDto> currentCards) {
        this.formatName = formatName;
        this.currentCards = currentCards;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<DeckCardItemDto> getCurrentCards() {
        return currentCards;
    }

    public void setCurrentCards(List<DeckCardItemDto> currentCards) {
        this.currentCards = currentCards;
    }
}
