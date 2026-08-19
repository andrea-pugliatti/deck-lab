package com.deck.lab.backend.dto.request;

import com.deck.lab.backend.model.DeckSection;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request Data Transfer Object (DTO) representing an individual card slot submitted by the client
 * when creating or updating a deck.
 */
public class DeckCardRequestDto {

    private Long id;

    @NotNull(message = "Card ID is required")
    private Long cardId;

    @NotNull(message = "Section is required")
    private DeckSection section;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 3, message = "Quantity cannot exceed 3")
    private Integer quantity;

    public DeckCardRequestDto() {
    }

    public DeckCardRequestDto(Long cardId, DeckSection section, Integer quantity) {
        this(null, cardId, section, quantity);
    }

    public DeckCardRequestDto(Long id, Long cardId, DeckSection section, Integer quantity) {
        this.id = id;
        this.cardId = cardId;
        this.section = section;
        this.quantity = quantity;
    }

    public DeckCardRequestDto(Long id, Long cardId, String section, Integer quantity) {
        this.id = id;
        this.cardId = cardId;
        this.section = section != null ? DeckSection.valueOf(section.toUpperCase()) : null;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCardId() {
        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }

    public DeckSection getSection() {
        return section;
    }

    public void setSection(DeckSection section) {
        this.section = section;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
