package com.deck.lab.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class DeckDto {
    private Long id;

    @NotBlank(message = "Deck name is required")
    private String name;

    private String description;

    @NotBlank(message = "Format name is required")
    private String formatName; // "TCG", "Goat", "Speed Duel", etc.

    @Valid
    private List<DeckCardDto> deckCards = new ArrayList<>();

    public DeckDto() {
    }

    public DeckDto(Long id, String name, String description, String formatName, List<DeckCardDto> deckCards) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.deckCards = deckCards;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<DeckCardDto> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCardDto> deckCards) {
        this.deckCards = deckCards;
    }
}
