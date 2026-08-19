package com.deck.lab.backend.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.model.Format;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data Transfer Object (DTO) representing a compiled deck list returned to clients.
 */
public class DeckResponseDto {

    private Long id;
    private String name;
    private String description;
    private Format formatName;

    @JsonProperty("deckCards")
    private List<DeckCardResponseDto> deckCards = new ArrayList<>();

    private LocalDateTime updatedAt;
    private String creatorUsername;

    public DeckResponseDto() {
    }

    public DeckResponseDto(Long id, String name, String description, Format formatName,
                           List<DeckCardResponseDto> deckCards, LocalDateTime updatedAt,
                           String creatorUsername) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.deckCards = deckCards != null ? deckCards : new ArrayList<>();
        this.updatedAt = updatedAt;
        this.creatorUsername = creatorUsername;
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
        this.deckCards = deckCards != null ? deckCards : new ArrayList<>();
    }

    /**
     * Alias for {@link #getDeckCards()} for internal mapper/service compatibility.
     */
    public List<DeckCardResponseDto> getCards() {
        return deckCards;
    }

    /**
     * Alias for {@link #setDeckCards(List)} for internal mapper/service compatibility.
     */
    public void setCards(List<DeckCardResponseDto> cards) {
        this.deckCards = cards != null ? cards : new ArrayList<>();
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatorUsername() {
        return creatorUsername;
    }

    public void setCreatorUsername(String creatorUsername) {
        this.creatorUsername = creatorUsername;
    }
}
