package com.deck.lab.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing an individual card slot in a deck.
 *
 * <p>
 * <strong>Data Transfer Object (DTO)</strong>
 * </p>
 * <p>
 * A DTO is an architectural design pattern used to transfer data between
 * software subsystems, specifically between the client-facing REST API
 * controller layer and the internal service/persistence layer. In this
 * application, {@code DeckCardDto} decouples the internal JPA relational entity
 * {@link DeckCard} from the raw JSON payloads sent/received over the network.
 * </p>
 *
 * <p>
 * <strong>Why decouple?</strong>
 * </p>
 * <ul>
 * <li><strong>Security:</strong>
 * Prevents exposing internal database schemas or primary key attributes
 * directly.</li>
 * <li><strong>Flexibility:</strong>
 * Allows modifying database schemas without breaking client-side API
 * contracts.</li>
 * <li><strong>Validation:</strong>
 * Acts as a form-backing object decorated with validation constraints to
 * validate incoming user data before it reaches the domain layer.</li>
 * <li><strong>Performance & Convenience:</strong>
 * Merges attributes from both the relationship {@code DeckCard} and the
 * referenced {@code Card} (e.g. name, imageUrl) to avoid extra query roundtrips
 * for the client.</li>
 * </ul>
 *
 * <p>
 * <strong>Validation Annotations used:</strong>
 * </p>
 * <ul>
 * <li>{@code @NotNull}: Enforces that the field cannot be null, returning a
 * validation error if it is missing.</li>
 * <li>{@code @NotBlank}: Enforces that string fields must not be empty or
 * consist solely of whitespace.</li>
 * <li>{@code @Min} and {@code @Max}: Enforces boundaries on numeric fields
 * (e.g., card quantities must be between 1 and 3).</li>
 * </ul>
 */
public class DeckCardDto {

    private Long id;

    @NotNull(message = "Card ID is required")
    private Long cardId;

    private String name;
    private String type;
    private String description;
    private String race;
    private String attribute;
    private String archetype;
    private String imageUrl;

    @NotBlank(message = "Section is required")
    private String section;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 3, message = "Quantity cannot exceed 3")
    private Integer quantity;

    public DeckCardDto() {
    }

    public DeckCardDto(Long id, Long cardId, String name, String type, String description, String race,
            String attribute,
            String archetype, String imageUrl, String section, Integer quantity) {
        this.id = id;
        this.cardId = cardId;
        this.name = name;
        this.type = type;
        this.description = description;
        this.race = race;
        this.attribute = attribute;
        this.archetype = archetype;
        this.imageUrl = imageUrl;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRace() {
        return race;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getArchetype() {
        return archetype;
    }

    public void setArchetype(String archetype) {
        this.archetype = archetype;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
