package com.deck.lab.backend.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.service.generation.CardEntry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing an incoming request payload to
 * suggest card additions/removals for a deck.
 *
 * <p>
 * <strong>Request DTO</strong>
 * </p>
 * <p>
 * This object encapsulates client payload parameters required for suggesting
 * deck improvements. Decouples controller parameters from persistent deck
 * entities, allowing clients to send unsaved deck configurations directly for
 * analysis.
 * </p>
 */
public class DeckSuggestRequestDto {
    @NotBlank(message = "Format name is required")
    private String formatName;

    @NotNull(message = "Current cards list is required")
    private List<CardEntry> currentCards = new ArrayList<>();

    public DeckSuggestRequestDto() {
    }

    public DeckSuggestRequestDto(String formatName, List<CardEntry> currentCards) {
        this.formatName = formatName;
        this.currentCards = currentCards;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<CardEntry> getCurrentCards() {
        return currentCards;
    }

    public void setCurrentCards(List<CardEntry> currentCards) {
        this.currentCards = currentCards;
    }
}
