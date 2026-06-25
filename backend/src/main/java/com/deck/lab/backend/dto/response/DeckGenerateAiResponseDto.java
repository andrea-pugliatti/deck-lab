package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.dto.CardEntryDto;

public class DeckGenerateAiResponseDto {
    private String name;
    private String description;
    private List<CardEntryDto> cards = new ArrayList<>();

    public DeckGenerateAiResponseDto() {
    }

    public DeckGenerateAiResponseDto(String name, String description, List<CardEntryDto> cards) {
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

    public List<CardEntryDto> getCards() {
        return cards;
    }

    public void setCards(List<CardEntryDto> cards) {
        this.cards = cards;
    }
}
