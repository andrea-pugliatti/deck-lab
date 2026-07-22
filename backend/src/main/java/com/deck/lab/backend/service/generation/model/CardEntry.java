package com.deck.lab.backend.service.generation.model;

import com.deck.lab.backend.model.DeckSection;

/**
 * Data Transfer Object (DTO) mapping raw card entries returned from the AI LLM generation.
 */
public class CardEntry {
    private String name;
    private DeckSection section;
    private Integer quantity;

    public CardEntry() {
    }

    public CardEntry(String name, DeckSection section, Integer quantity) {
        this.name = name;
        this.section = section;
        this.quantity = quantity;
    }

    public CardEntry(String name, String section, Integer quantity) {
        this.name = name;
        DeckSection parsedSection = null;
        if (section != null && !section.isBlank()) {
            try {
                parsedSection = DeckSection.fromString(section);
            } catch (IllegalArgumentException e) {
                parsedSection = null;
            }
        }
        this.section = parsedSection;
        this.quantity = quantity;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}