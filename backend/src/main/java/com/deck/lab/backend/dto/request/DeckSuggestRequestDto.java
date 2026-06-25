package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.dto.CardEntryDto;

public class DeckSuggestRequestDto {
    @NotBlank(message = "Format name is required")
    private String formatName;

    @NotNull(message = "Current cards list is required")
    private List<CardEntryDto> currentCards = new ArrayList<>();

    public DeckSuggestRequestDto() {
    }

    public DeckSuggestRequestDto(String formatName, List<CardEntryDto> currentCards) {
        this.formatName = formatName;
        this.currentCards = currentCards;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<CardEntryDto> getCurrentCards() {
        return currentCards;
    }

    public void setCurrentCards(List<CardEntryDto> currentCards) {
        this.currentCards = currentCards;
    }
}
