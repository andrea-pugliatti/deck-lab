package com.deck.lab.backend.dto;

public class CardSuggestionDto {
    private String name;
    private String section;
    private String synergyReason;
    private Long cardId;
    private String type;
    private String imageUrl;

    public CardSuggestionDto() {
    }

    public CardSuggestionDto(String name, String section, String synergyReason) {
        this.name = name;
        this.section = section;
        this.synergyReason = synergyReason;
    }

    public CardSuggestionDto(String name, String section, String synergyReason, Long cardId, String type,
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

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
