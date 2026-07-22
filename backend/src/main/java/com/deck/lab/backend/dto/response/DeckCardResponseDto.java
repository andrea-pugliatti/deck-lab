package com.deck.lab.backend.dto.response;

import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.DeckSection;

/**
 * Response Data Transfer Object (DTO) representing an individual card slot in a deck as returned to
 * the client.
 */
public class DeckCardResponseDto {

    private Long id;
    private Long cardId;
    private String name;
    private CardType type;
    private String description;
    private CardRace race;
    private CardAttribute attribute;
    private String archetype;
    private String imageUrl;
    private DeckSection section;
    private Integer quantity;

    public DeckCardResponseDto() {
    }

    public DeckCardResponseDto(Long id,
                               Long cardId,
                               String name,
                               CardType type,
                               String description,
                               CardRace race,
                               CardAttribute attribute,
                               String archetype,
                               String imageUrl,
                               DeckSection section,
                               Integer quantity) {
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

    public CardType getType() {
        return type;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CardRace getRace() {
        return race;
    }

    public void setRace(CardRace race) {
        this.race = race;
    }

    public CardAttribute getAttribute() {
        return attribute;
    }

    public void setAttribute(CardAttribute attribute) {
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
