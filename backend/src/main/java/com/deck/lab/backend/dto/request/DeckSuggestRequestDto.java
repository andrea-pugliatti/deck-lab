package com.deck.lab.backend.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.service.generation.model.CardEntry;

import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing an incoming request payload to suggest card
 * additions/removals for a deck.
 */
public class DeckSuggestRequestDto {
    @NotNull(message = "Format name is required")
    private Format formatName;

    @NotNull(message = "Current cards list is required")
    private List<CardEntry> currentCards = new ArrayList<>();

    public DeckSuggestRequestDto() {
    }

    public DeckSuggestRequestDto(Format formatName, List<CardEntry> currentCards) {
        this.formatName = formatName;
        this.currentCards = currentCards;
    }

    public DeckSuggestRequestDto(String formatName, List<CardEntry> currentCards) {
        this.formatName = Format.fromString(formatName);
        this.currentCards = currentCards;
    }

    public Format getFormatName() {
        return formatName;
    }

    public void setFormatName(Format formatName) {
        this.formatName = formatName;
    }

    public List<CardEntry> getCurrentCards() {
        return currentCards;
    }

    public void setCurrentCards(List<CardEntry> currentCards) {
        this.currentCards = currentCards;
    }
}
