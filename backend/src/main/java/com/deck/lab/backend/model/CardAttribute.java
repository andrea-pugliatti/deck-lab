package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining the elemental attributes of monster cards.
 *
 * <p>
 * <strong>Serialization Details:</strong>
 * </p>
 * <ul>
 * <li>{@code @JsonValue}: Serializes elements as capital string tokens (e.g.
 * "LIGHT", "DARK") conforming to database structures.</li>
 * <li>{@code @JsonCreator}: Parser enabling case-insensitive parameter
 * conversions from inbound requests.</li>
 * </ul>
 */
public enum CardAttribute {
    LIGHT("LIGHT"),
    DARK("DARK"),
    WATER("WATER"),
    FIRE("FIRE"),
    EARTH("EARTH"),
    WIND("WIND"),
    DIVINE("DIVINE");

    private final String value;

    CardAttribute(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CardAttribute fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        for (CardAttribute attr : CardAttribute.values()) {
            if (attr.value.equalsIgnoreCase(trimmed)) {
                return attr;
            }
        }
        throw new IllegalArgumentException("Unknown card attribute: " + value);
    }
}
