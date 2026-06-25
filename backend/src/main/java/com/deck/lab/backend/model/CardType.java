package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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
    FUSION_PENDULUM_EFFECT_MONSTER("Fusion Pendulum Effect Monster"),
    TUNER_MONSTER("Tuner Monster"),
    GEMINI_MONSTER("Gemini Monster"),
    SPIRIT_MONSTER("Spirit Monster"),
    TOON_MONSTER("Toon Monster"),
    UNION_EFFECT_MONSTER("Union Effect Monster"),
    FLIP_EFFECT_MONSTER("Flip Effect Monster"),
    FLIP_TUNER_EFFECT_MONSTER("Flip Tuner Effect Monster"),
    PENDULUM_EFFECT_TUNER_MONSTER("Pendulum Effect Tuner Monster"),
    SPECIAL_SUMMON_MONSTER("Special Summon Monster"),
    PENDULUM_FLIP_EFFECT_MONSTER("Pendulum Flip Effect Monster"),
    PENDULUM_EFFECT_SPECIAL_SUMMON_MONSTER("Pendulum Effect Special Summon Monster"),
    SYNCHRO_TUNER_MONSTER("Synchro Tuner Monster");

    private final String value;

    CardType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public boolean isExtraDeck() {
        return this == FUSION_MONSTER || this == SYNCHRO_MONSTER || this == XYZ_MONSTER || this == LINK_MONSTER 
            || this == SYNCHRO_TUNER_MONSTER || this == SYNCHRO_PENDULUM_EFFECT_MONSTER 
            || this == XYZ_PENDULUM_EFFECT_MONSTER || this == FUSION_PENDULUM_EFFECT_MONSTER;
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
