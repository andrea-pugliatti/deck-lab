package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DeckSection {
    MAIN("MAIN"),
    EXTRA("EXTRA"),
    SIDE("SIDE");

    private final String value;

    DeckSection(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static DeckSection fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim().toUpperCase();
        for (DeckSection section : DeckSection.values()) {
            if (section.value.equals(trimmed)) {
                return section;
            }
        }
        throw new IllegalArgumentException("Unknown deck section: " + value);
    }
}
