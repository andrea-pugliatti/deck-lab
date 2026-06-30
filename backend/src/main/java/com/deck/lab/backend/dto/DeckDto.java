package com.deck.lab.backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object (DTO) representing a compiled deck list.
 *
 * <p>
 * <strong>Data Transfer Object (DTO)</strong>
 * </p>
 * <p>
 * This DTO defines the structural API boundaries for exposing deck structures
 * to the frontend client. It contains high-level deck details (like name,
 * description, format constraints) along with its list of associated cards.
 * Using a separate DTO instead of serializing the {@link Deck} entity directly
 * prevents issues like lazy-loading exceptions, circular references with
 * bidirectional relationships, and leakage of user information.
 * </p>
 *
 * <p>
 * <strong>Recursive Validation with {@code @Valid}:</strong>
 * </p>
 * <p>
 * By placing the {@code @Valid} annotation on the {@code deckCards} collection
 * field, we instruct the Spring validation engine to recursively descend and
 * execute validation constraints declared on each {@link DeckCardDto} element
 * in the list. If any card inside the list violates its validation constraints
 * (e.g. quantity exceeding 3), the parent object will fail validation, and
 * Spring will raise a {@code MethodArgumentNotValidException} before executing
 * the controller code.
 * </p>
 */
public class DeckDto {

    private Long id;

    @NotBlank(message = "Deck name is required")
    private String name;

    private String description;

    @NotBlank(message = "Format name is required")
    private String formatName;

    @Valid
    private List<DeckCardDto> deckCards = new ArrayList<>();

    private LocalDateTime updatedAt;

    private String creatorUsername;

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
