package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request Data Transfer Object (DTO) representing an individual card slot
 * submitted by the client when creating or updating a deck.
 *
 * <p>
 * <strong>Request DTO</strong>
 * </p>
 * <p>
 * Only the fields required to identify and place a card in a deck section are
 * accepted from the client. Card display attributes (name, type, imageUrl,
 * etc.) are resolved server-side from the database and are never trusted from
 * the incoming payload.
 * </p>
 */
public class DeckCardRequestDto {

    /**
     * Optional DeckCard record ID used to match an existing slot during updates.
     * When null, a new DeckCard entry will be created.
     */
    private Long id;

    @NotNull(message = "Card ID is required")
    private Long cardId;

    @NotBlank(message = "Section is required")
    private String section;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 3, message = "Quantity cannot exceed 3")
    private Integer quantity;

    public DeckCardRequestDto() {
    }

    public DeckCardRequestDto(Long id, Long cardId, String section, Integer quantity) {
        this.id = id;
        this.cardId = cardId;
        this.section = section;
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

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
