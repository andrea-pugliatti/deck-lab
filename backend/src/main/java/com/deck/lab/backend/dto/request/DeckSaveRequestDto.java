package com.deck.lab.backend.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.model.Format;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object representing an inbound deck create or update request.
 */
public class DeckSaveRequestDto {

    @NotBlank(message = "Deck name is required")
    private String name;

    private String description;

    @NotNull(message = "Format name is required")
    private Format formatName;

    private List<@Valid DeckCardRequestDto> deckCards = new ArrayList<>();

    public DeckSaveRequestDto() {
    }

    public DeckSaveRequestDto(String name, String description, Format formatName,
                              List<DeckCardRequestDto> deckCards) {
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.deckCards = deckCards != null ? deckCards : new ArrayList<>();
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

    public List<DeckCardRequestDto> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCardRequestDto> deckCards) {
        this.deckCards = deckCards != null ? deckCards : new ArrayList<>();
    }
}
