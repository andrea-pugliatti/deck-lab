package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum defining card monster races and spell/trap sub-classifications.
 *
 * <p>
 * <strong>Design Context:</strong>
 * </p>
 * <p>
 * In the Yu-Gi-Oh! card database, the "race" attribute is overloaded: for monster cards, it
 * represents physical races (e.g. Dragon, Spellcaster, Zombie); for Spell and Trap cards, it
 * represents mechanics sub-categories (e.g. Continuous, Counter, Quick-Play).
 * </p>
 *
 * <p>
 * <strong>Serialization Annotations:</strong>
 * </p>
 * <ul>
 * <li>{@code @JsonValue}: Formats enums to human-friendly strings (e.g. "Beast-Warrior",
 * "Quick-Play") for REST transmissions.</li>
 * <li>{@code @JsonCreator}: Resolves incoming API strings case-insensitively to matching enum
 * entries.</li>
 * </ul>
 */
public enum CardRace {
    AQUA("Aqua"),
    BEAST("Beast"),
    BEAST_WARRIOR("Beast-Warrior"),
    CREATOR_GOD("Creator God"),
    CYBERSE("Cyberse"),
    DINOSAUR("Dinosaur"),
    DIVINE_BEAST("Divine-Beast"),
    DRAGON("Dragon"),
    FAIRY("Fairy"),
    FIEND("Fiend"),
    FISH("Fish"),
    ILLUSION("Illusion"),
    INSECT("Insect"),
    MACHINE("Machine"),
    PLANT("Plant"),
    PSYCHIC("Psychic"),
    PYRO("Pyro"),
    REPTILE("Reptile"),
    ROCK("Rock"),
    SEA_SERPENT("Sea Serpent"),
    SPELLCASTER("Spellcaster"),
    THUNDER("Thunder"),
    WARRIOR("Warrior"),
    WINGED_BEAST("Winged Beast"),
    WYRM("Wyrm"),
    ZOMBIE("Zombie"),

    // Spell/Trap Subtypes
    NORMAL("Normal"),
    CONTINUOUS("Continuous"),
    COUNTER("Counter"),
    QUICK_PLAY("Quick-Play"),
    EQUIP("Equip"),
    FIELD("Field"),
    RITUAL("Ritual"),

    // Others
    SKILL("Skill"),
    TOKEN("Token");

    private final String value;

    CardRace(String value) {
        this.value = value;
    }

    /**
     * Gets the string representation of the card race or subtype.
     *
     * @return the serialized race or subtype string
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * Resolves a card race or subtype from its string representation (case-insensitive).
     *
     * @param value the race or subtype string
     * @return the resolved CardRace enum
     * @throws IllegalArgumentException if the string is unknown
     */
    @JsonCreator
    public static CardRace fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        for (CardRace race : CardRace.values()) {
            if (race.value.equalsIgnoreCase(trimmed)) {
                return race;
            }
        }
        throw new IllegalArgumentException("Unknown card race: " + value);
    }
}
