package com.deck.lab.backend.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.model.Format;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing a compiled deck list.
 */
public class DeckResponseDto {

    private Long id;

    @NotBlank(message = "Deck name is required")
    private String name;

    private String description;

    @NotNull(message = "Format name is required")
    private Format formatName;

    /**
     * Inbound card slots from the client request. Validated on write operations.
     */
    @JsonIgnore
    private List<@Valid DeckCardRequestDto> deckCards = new ArrayList<>();

    /**
     * Outbound enriched card details populated by the server on read operations.
     */
    @JsonIgnore
    private List<DeckCardResponseDto> cards = new ArrayList<>();

    private LocalDateTime updatedAt;

    private String creatorUsername;

    public DeckResponseDto() {
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

    @JsonIgnore
    public List<DeckCardRequestDto> getDeckCards() {
        return deckCards;
    }

    @JsonProperty("deckCards")
    public void setDeckCards(List<DeckCardRequestDto> deckCards) {
        this.deckCards = deckCards;
    }

    @JsonIgnore
    public List<DeckCardResponseDto> getCards() {
        return cards;
    }

    @JsonIgnore
    public void setCards(List<DeckCardResponseDto> cards) {
        this.cards = cards;
    }

    @JsonProperty("deckCards")
    public List<?> getJsonDeckCards() {
        if (this.cards != null && !this.cards.isEmpty()) {
            return this.cards;
        }
        return this.deckCards;
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
