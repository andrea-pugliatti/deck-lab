package com.deck.lab.backend.dto.response;

/**
 * Response Data Transfer Object (DTO) representing an individual card slot in
 * a deck as returned to the client.
 *
 * <p>
 * <strong>Response DTO</strong>
 * </p>
 * <p>
 * Combines attributes from both the {@code DeckCard} relationship (section,
 * quantity, record ID) and the referenced {@code Card} entity (name, type,
 * imageUrl, etc.) to avoid extra query roundtrips for the client.
 * </p>
 */
public class DeckCardResponseDto {

    private Long id;
    private Long cardId;
    private String name;
    private String type;
    private String description;
    private String race;
    private String attribute;
    private String archetype;
    private String imageUrl;
    private String section;
    private Integer quantity;

    public DeckCardResponseDto() {
    }

    public DeckCardResponseDto(Long id, Long cardId, String name, String type, String description, String race,
            String attribute, String archetype, String imageUrl, String section, Integer quantity) {
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
