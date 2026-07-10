package com.deck.lab.backend.service.generation;

import java.util.List;

/**
 * Request record containing target card names.
 */
public record DeckStatsRequest(List<String> cardNames) {
}