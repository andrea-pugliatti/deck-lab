package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

public class DeckGenerateAiResponseDto {
    private String name;
    private String description;
    private List<CardEntry> cards = new ArrayList<>();

    public DeckGenerateAiResponseDto() {
    }

    public DeckGenerateAiResponseDto(String name, String description, List<CardEntry> cards) {
        this.name = name;
        this.description = description;
        this.cards = cards;
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

    public List<CardEntry> getCards() {
        return cards;
    }

    public void setCards(List<CardEntry> cards) {
        this.cards = cards;
    }

    public static class CardEntry {
        private String name;
        private String section;
        private Integer quantity;

        public CardEntry() {
        }

        public CardEntry(String name, String section, Integer quantity) {
            this.name = name;
            this.section = section;
            this.quantity = quantity;
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

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
