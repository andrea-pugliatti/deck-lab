package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining the visual frame color styles corresponding to card categories.
 *
 * <p>
 * <strong>Design Intent:</strong>
 * </p>
 * <p>
 * Used primarily by frontend applications to dynamically apply correct
 * background stylesheets, borders, and font styles matching the physical
 * Yu-Gi-Oh! card frames (e.g. green spell card borders, purple fusion monster
 * frames).
 * </p>
 *
 * <p>
 * <strong>Serialization Annotations:</strong>
 * </p>
 * <ul>
 * <li>{@code @JsonValue}: Serializes enums using their lowercase database names
 * (e.g., "normal_pendulum", "fusion").</li>
 * <li>{@code @JsonCreator}: Factory parsing utility supporting case-insensitive
 * deserialization of inbound API values.</li>
 * </ul>
 */
public enum FrameType {
    NORMAL("normal"),
    EFFECT("effect"),
    FUSION("fusion"),
    RITUAL("ritual"),
    SYNCHRO("synchro"),
    XYZ("xyz"),
    PENDULUM("pendulum"),
    LINK("link"),
    SPELL("spell"),
    TRAP("trap"),
    TOKEN("token"),
    SKILL("skill"),
    NORMAL_PENDULUM("normal_pendulum"),
    EFFECT_PENDULUM("effect_pendulum"),
    FUSION_PENDULUM("fusion_pendulum"),
    SYNCHRO_PENDULUM("synchro_pendulum"),
    XYZ_PENDULUM("xyz_pendulum");

    private final String value;

    FrameType(String value) {
        this.value = value;
    }

    /**
     * Gets the string representation of the frame type.
     *
     * @return the serialized frame type string
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Resolves a frame type from its string representation (case-insensitive).
     *
     * @param value the frame type string
     * @return the resolved FrameType enum
     * @throws IllegalArgumentException if the frame type string is unknown
     */
    @JsonCreator
    public static FrameType fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        for (FrameType type : FrameType.values()) {
            if (type.value.equalsIgnoreCase(trimmed)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown frame type: " + value);
    }
}
