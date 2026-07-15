package com.deck.lab.backend.service.generation.tool.dto;

import java.util.List;

/**
 * Request record containing target card names.
 */
public record DeckStatsRequest(List<String> cardNames) {}