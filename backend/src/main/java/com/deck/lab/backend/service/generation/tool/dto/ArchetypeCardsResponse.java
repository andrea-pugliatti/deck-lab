package com.deck.lab.backend.service.generation.tool.dto;

import java.util.List;

/**
 * Response record containing list of matching cards.
 */
public record ArchetypeCardsResponse(String archetype, List<ArchetypeCardInfo> cards) {
}