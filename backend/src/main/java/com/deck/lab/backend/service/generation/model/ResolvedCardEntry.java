package com.deck.lab.backend.service.generation.model;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.DeckSection;

/**
 * Record representing a card successfully resolved from the database, along with its quantity and
 * target deck section assignment.
 */
public record ResolvedCardEntry(Card card, DeckSection section, int quantity) {
    public ResolvedCardEntry(Card card, String section, int quantity) {
        this(card, parseSection(section), quantity);
    }

    private static DeckSection parseSection(String section) {
        if (section == null || section.isBlank()) {
            return DeckSection.MAIN;
        }
        try {
            return DeckSection.fromString(section);
        } catch (IllegalArgumentException e) {
            return DeckSection.MAIN;
        }
    }
}
