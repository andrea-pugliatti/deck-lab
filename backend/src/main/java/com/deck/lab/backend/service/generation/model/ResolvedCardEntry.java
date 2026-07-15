package com.deck.lab.backend.service.generation.model;

import com.deck.lab.backend.model.Card;

/**
 * Record representing a card successfully resolved from the database, along with its quantity and
 * target deck section assignment.
 */
public record ResolvedCardEntry(Card card, String section, int quantity) {}
