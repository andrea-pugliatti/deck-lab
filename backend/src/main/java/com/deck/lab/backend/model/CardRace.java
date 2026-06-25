package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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

    @JsonValue
    public String getValue() {
        return value;
    }

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
