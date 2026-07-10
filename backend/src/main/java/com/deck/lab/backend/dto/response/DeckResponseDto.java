package com.deck.lab.backend.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;

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
 * <strong>Dual-role field design:</strong>
 * </p>
 * <ul>
 * <li>{@code deckCards}: Inbound field. Accepts the client request payload —
 * only {@code cardId}, {@code section}, and {@code quantity} are read from this
 * list. Decorated with {@code @Valid} to trigger recursive bean validation on
 * each {@link DeckCardRequestDto} element.</li>
 * <li>{@code cards}: Outbound field. Populated by the mapper when building the
 * server response — includes enriched card attributes (name, type, imageUrl,
 * etc.) resolved from the database.</li>
 * </ul>
 */
public class DeckResponseDto {

    private Long id;

    @NotBlank(message = "Deck name is required")
    private String name;

    private String description;

    @NotBlank(message = "Format name is required")
    private String formatName;

    /**
     * Inbound card slots from the client request. Validated on write operations.
     */
    @Valid
    private List<DeckCardRequestDto> deckCards = new ArrayList<>();

    /**
     * Outbound enriched card details populated by the server on read operations.
     */
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

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<DeckCardRequestDto> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCardRequestDto> deckCards) {
        this.deckCards = deckCards;
    }

    public List<DeckCardResponseDto> getCards() {
        return cards;
    }

    public void setCards(List<DeckCardResponseDto> cards) {
        this.cards = cards;
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
