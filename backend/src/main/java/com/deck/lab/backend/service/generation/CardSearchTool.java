package com.deck.lab.backend.service.generation;

import java.util.List;
import java.util.function.Function;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;

/**
 * Tool function enabling the AI model to query authentic Yu-Gi-Oh! cards from
 * the database.
 */
public class CardSearchTool implements Function<CardSearchRequest, CardSearchResponse> {

    private final CardRepository cardRepository;

    public CardSearchTool(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Executes the card search tool, querying card entries matching a target search
     * term.
     *
     * @param request the card search request containing the query search term
     * @return a structured CardSearchResponse with up to 15 matching card summaries
     */
    @Override
    public CardSearchResponse apply(CardSearchRequest request) {
        if (request.query() == null || request.query().isBlank()) {
            return new CardSearchResponse(List.of());
        }

        List<Card> cards = cardRepository.findByNameContainingIgnoreCase(request.query().trim());

        // Limit results to 15 to avoid cluttering LLM context
        List<CardSearchResult> results = cards.stream()
                .limit(15)
                .map(c -> new CardSearchResult(
                        c.getId(),
                        c.getName(),
                        c.getType() != null ? c.getType().getValue() : null,
                        c.getArchetype()))
                .toList();

        return new CardSearchResponse(results);
    }
}
