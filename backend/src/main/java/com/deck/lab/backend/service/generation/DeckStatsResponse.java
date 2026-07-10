package com.deck.lab.backend.service.generation;

import java.util.Map;

/**
 * Response record containing computed deck composition ratios and averages.
 */
public record DeckStatsResponse(
        int totalCards,
        int monsterCount,
        double monsterPct,
        int spellCount,
        double spellPct,
        int trapCount,
        double trapPct,
        double averageAtk,
        double averageDef,
        double averageLevel,
        Map<String, Integer> attributes,
        Map<String, Integer> archetypes) {
}