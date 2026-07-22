package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.model.Format;

/**
 * Data Transfer Object (DTO) representing the response payload for a successfully generated deck
 * list.
 */
public class DeckGenerationResponseDto {
    private String name;
    private String description;
    private Format formatName;
    private List<DeckCardResponseDto> deckCards = new ArrayList<>();
    private List<String> validationWarnings = new ArrayList<>();

    public DeckGenerationResponseDto() {
    }

    public DeckGenerationResponseDto(String name,
                                     String description,
                                     Format formatName,
                                     List<DeckCardResponseDto> deckCards,
                                     List<String> validationWarnings) {
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.deckCards = deckCards;
        this.validationWarnings = validationWarnings;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Format getFormatName() {
        return formatName;
    }

    public void setFormatName(Format formatName) {
        this.formatName = formatName;
    }

    public List<DeckCardResponseDto> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCardResponseDto> deckCards) {
        this.deckCards = deckCards;
    }

    public List<String> getValidationWarnings() {
        return validationWarnings;
    }

    public void setValidationWarnings(List<String> validationWarnings) {
        this.validationWarnings = validationWarnings;
    }
}
