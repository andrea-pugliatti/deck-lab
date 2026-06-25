package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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

    @JsonValue
    public String getValue() {
        return value;
    }

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
