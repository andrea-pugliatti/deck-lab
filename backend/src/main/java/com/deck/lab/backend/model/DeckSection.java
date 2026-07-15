package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining the physical sections of a Yu-Gi-Oh! deck list.
 *
 * <p>
 * <strong>Deck Construction Context:</strong>
 * </p>
 * <ul>
 * <li>{@code MAIN}: The primary deck containing Spell, Trap, and Main Deck Monster cards. Usually
 * sized between 40 and 60 cards.</li>
 * <li>{@code EXTRA}: The repository containing special Fusion, Synchro, Xyz, and Link monsters.
 * Usually limited to 15 cards.</li>
 * <li>{@code SIDE}: A secondary card pool used for mid-match adjustments between games. Usually
 * limited to 15 cards.</li>
 * </ul>
 */
public enum DeckSection {
    MAIN("MAIN"),
    EXTRA("EXTRA"),
    SIDE("SIDE");

    private final String value;

    DeckSection(String value) {
        this.value = value;
    }

    /**
     * Gets the string representation of the deck section.
     *
     * @return the serialized deck section string
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Resolves a deck section from its string representation (case-insensitive).
     *
     * @param value the deck section string
     * @return the resolved DeckSection enum
     * @throws IllegalArgumentException if the string is unknown
     */
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
