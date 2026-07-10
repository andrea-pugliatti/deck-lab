package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining the supported Yu-Gi-Oh! game format environments.
 *
 * <p>
 * <strong>Jackson Serialization Mappings:</strong>
 * </p>
 * <ul>
 * <li>{@code @JsonValue}: Marks the method returns the serialized
 * representation of this enum (e.g. "Goat" or "Edison") so that Jackson maps
 * the string instead of the raw enum identifier (e.g. {@code GOAT} or
 * {@code EDISON}).</li>
 * <li>{@code @JsonCreator}: Factory method that Jackson calls when
 * deserializing a JSON string payload back into this enum structure. Enables
 * flexible case-insensitive matching when clients send format codes.</li>
 * </ul>
 */
public enum Format {
    TCG("TCG"),
    OCG("OCG"),
    GOAT("Goat"),
    EDISON("Edison"),
    TENGU_PLANT("Tengu Plant"),
    HAT_FORMAT("HAT Format"),
    SPEED_DUEL("Speed Duel"),
    MASTER_DUEL("Master Duel"),
    RUSH_DUEL("Rush Duel");

    private final String value;

    Format(String value) {
        this.value = value;
    }

    /**
     * Gets the string value of the format.
     *
     * @return the serialized string representation
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Resolves a format from its string representation (case-insensitive).
     *
     * @param value the format string
     * @return the resolved Format enum
     * @throws IllegalArgumentException if the format string is unknown
     */
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
