package com.deck.lab.backend.dto.response;

import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.DeckSection;

/**
 * Data Transfer Object (DTO) conveying card suggestions recommended by AI models.
 */
public class CardSuggestionResponseDto {

    private String name;
    private DeckSection section;
    private String synergyReason;
    private Long cardId;
    private CardType type;
    private String imageUrl;

    public CardSuggestionResponseDto() {
    }

    public CardSuggestionResponseDto(String name, DeckSection section, String synergyReason) {
        this.name = name;
        this.section = section;
        this.synergyReason = synergyReason;
    }

    public CardSuggestionResponseDto(String name,
                                     DeckSection section,
                                     String synergyReason,
                                     Long cardId,
                                     CardType type,
                                     String imageUrl) {
        this.name = name;
        this.section = section;
        this.synergyReason = synergyReason;
        this.cardId = cardId;
        this.type = type;
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeckSection getSection() {
        return section;
    }

    public void setSection(DeckSection section) {
        this.section = section;
    }

    public String getSynergyReason() {
        return synergyReason;
    }

    public void setSynergyReason(String synergyReason) {
        this.synergyReason = synergyReason;
    }

    public Long getCardId() {
        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }

    public CardType getType() {
        return type;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
