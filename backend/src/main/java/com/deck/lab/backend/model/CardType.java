package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining all possible classification categories for a Yu-Gi-Oh! card.
 *
 * <p>
 * <strong>Serialization & Deserialization:</strong>
 * </p>
 * <ul>
 * <li>{@code @JsonValue}: Ensures cards serialize with client-friendly
 * formatted names (e.g. "Normal Monster", "Spell Card").</li>
 * <li>{@code @JsonCreator}: Provides a case-insensitive parser mapping inbound
 * API JSON strings to their respective enum instances.</li>
 * </ul>
 */
public enum CardType {
    NORMAL_MONSTER("Normal Monster"),
    EFFECT_MONSTER("Effect Monster"),
    RITUAL_MONSTER("Ritual Monster"),
    RITUAL_EFFECT_MONSTER("Ritual Effect Monster"),
    FUSION_MONSTER("Fusion Monster"),
    SYNCHRO_MONSTER("Synchro Monster"),
    XYZ_MONSTER("Xyz Monster"),
    LINK_MONSTER("Link Monster"),
    SPELL_CARD("Spell Card"),
    TRAP_CARD("Trap Card"),
    TOKEN("Token"),
    SKILL_CARD("Skill Card"),
    PENDULUM_EFFECT_MONSTER("Pendulum Effect Monster"),
    PENDULUM_NORMAL_MONSTER("Pendulum Normal Monster"),
    SYNCHRO_PENDULUM_EFFECT_MONSTER("Synchro Pendulum Effect Monster"),
    XYZ_PENDULUM_EFFECT_MONSTER("XYZ Pendulum Effect Monster"),
    PENDULUM_EFFECT_FUSION_MONSTER("Pendulum Effect Fusion Monster"),
    TUNER_MONSTER("Tuner Monster"),
    GEMINI_MONSTER("Gemini Monster"),
    SPIRIT_MONSTER("Spirit Monster"),
    TOON_MONSTER("Toon Monster"),
    UNION_EFFECT_MONSTER("Union Effect Monster"),
    FLIP_EFFECT_MONSTER("Flip Effect Monster"),
    FLIP_TUNER_EFFECT_MONSTER("Flip Tuner Effect Monster"),
    PENDULUM_TUNER_EFFECT_MONSTER("Pendulum Tuner Effect Monster"),
    SPECIAL_SUMMON_MONSTER("Special Summon Monster"),
    PENDULUM_FLIP_EFFECT_MONSTER("Pendulum Flip Effect Monster"),
    PENDULUM_EFFECT_SPECIAL_SUMMON_MONSTER("Pendulum Effect Special Summon Monster"),
    SYNCHRO_TUNER_MONSTER("Synchro Tuner Monster"),
    NORMAL_TUNER_MONSTER("Normal Tuner Monster"),
    PENDULUM_EFFECT_RITUAL_MONSTER("Pendulum Effect Ritual Monster");

    private final String value;

    CardType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Determines whether this card type is historically placed in the Extra Deck
     * instead of the Main Deck.
     * Used by validation rules to enforce correct card placements.
     *
     * @return true if the card is a Fusion, Synchro, Xyz, Link, or related pendulum
     *         subtype.
     */
    public boolean isExtraDeck() {
        return this == FUSION_MONSTER || this == SYNCHRO_MONSTER || this == XYZ_MONSTER || this == LINK_MONSTER
                || this == SYNCHRO_TUNER_MONSTER || this == SYNCHRO_PENDULUM_EFFECT_MONSTER
                || this == XYZ_PENDULUM_EFFECT_MONSTER || this == PENDULUM_EFFECT_FUSION_MONSTER;
    }

    @JsonCreator
    public static CardType fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        for (CardType type : CardType.values()) {
            if (type.value.equalsIgnoreCase(trimmed)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown card type: " + value);
    }
}
