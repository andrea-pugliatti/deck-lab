package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Format {
    TCG("TCG"),
    OCG("OCG"),
    GOAT("Goat"),
    EDISON("Edison"),
    TENGU_PLANT("Tengu Plant"),
    HAT_FORMAT("HAT Format"),
    SPEED_DUEL("Speed Duel");

    private final String value;

    Format(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Format fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        for (Format f : Format.values()) {
            if (f.value.equalsIgnoreCase(trimmed)) {
                return f;
            }
        }
        throw new IllegalArgumentException("Unknown format: " + value);
    }
}
