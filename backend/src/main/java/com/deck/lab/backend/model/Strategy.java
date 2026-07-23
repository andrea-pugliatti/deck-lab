package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum representing supported playstyle strategies for deck building and AI generation.
 */
public enum Strategy {
    NONE("None"),
    COMBO("Combo"),
    CONTROL("Control"),
    AGGRO("Aggro"),
    MIDRANGE("Midrange"),
    GOING_SECOND("Going Second"),
    STALL_BURN("Stall/Burn"),
    PURE("Pure");

    private final String value;

    Strategy(String value) {
        this.value = value;
    }

    /**
     * Gets the serialized string representation of the strategy.
     *
     * @return the serialized string value
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Resolves a Strategy from its string representation (case-insensitive).
     * Falls back to {@link #NONE} if unrecognized or null.
     *
     * @param value the strategy string
     * @return the resolved Strategy enum (defaults to NONE)
     */
    @JsonCreator
    public static Strategy fromString(String value) {
        if (value == null || value.isBlank()) {
            return NONE;
        }
        String trimmed = value.trim();
        String normalized = trimmed.replace('_', ' ');
        for (Strategy s : Strategy.values()) {
            if (s.value.equalsIgnoreCase(trimmed)
                    || s.name().equalsIgnoreCase(trimmed)
                    || s.value.replace('_', ' ').equalsIgnoreCase(normalized)
                    || s.name().replace('_', ' ').equalsIgnoreCase(normalized)) {
                return s;
            }
        }
        return NONE;
    }
}
