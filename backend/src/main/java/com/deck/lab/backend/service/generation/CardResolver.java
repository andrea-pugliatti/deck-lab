package com.deck.lab.backend.service.generation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.deck.lab.backend.dto.CardEntryDto;
import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;

/**
 * Service responsible for mapping AI-generated card names to actual database card records.
 */
@Service
public class CardResolver {

    private final CardRepository cardRepository;

    public CardResolver(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Resolves card names to database records and normalizes quantity/sections.
     *
     * @param entries list of raw card entries from the AI response
     * @return a list of resolved card entries containing the database entity and quantity
     */
    public List<ResolvedCardEntry> resolveCards(List<CardEntryDto> entries) {
        List<ResolvedCardEntry> resolved = new ArrayList<>();
        if (entries == null) {
            return resolved;
        }

        for (CardEntryDto entry : entries) {
            if (entry.getName() == null || entry.getName().isBlank()) {
                continue;
            }

            Optional<Card> dbCardOpt = lookupCard(entry.getName());
            if (dbCardOpt.isPresent()) {
                Card card = dbCardOpt.get();
                
                String section = entry.getSection() != null ? entry.getSection().toUpperCase() : "MAIN";
                if (!List.of("MAIN", "EXTRA", "SIDE").contains(section)) {
                    section = "MAIN";
                }

                Integer quantity = entry.getQuantity();
                if (quantity == null || quantity < 1) {
                    quantity = 1;
                } else if (quantity > 3) {
                    quantity = 3;
                }

                resolved.add(new ResolvedCardEntry(card, section, quantity));
            }
        }
        return resolved;
    }

    /**
     * Resolves card suggestions by mapping suggested names to real database records.
     *
     * @param suggestions list of suggestions from the AI response
     * @return a list of resolved card suggestions containing database attributes
     */
    public List<CardSuggestionDto> resolveSuggestions(List<CardSuggestionDto> suggestions) {
        List<CardSuggestionDto> resolved = new ArrayList<>();
        if (suggestions == null) {
            return resolved;
        }

        for (CardSuggestionDto suggestion : suggestions) {
            if (suggestion.getName() == null || suggestion.getName().isBlank()) {
                continue;
            }

            Optional<Card> dbCardOpt = lookupCard(suggestion.getName());
            if (dbCardOpt.isPresent()) {
                Card card = dbCardOpt.get();
                resolved.add(new CardSuggestionDto(
                        card.getName(),
                        suggestion.getSection() != null ? suggestion.getSection().toUpperCase() : "MAIN",
                        suggestion.getSynergyReason() != null ? suggestion.getSynergyReason() : "Provides good synergy.",
                        card.getId(),
                        card.getType() != null ? card.getType().getValue() : null,
                        card.getImageUrlCropped()
                ));
            }
        }
        return resolved;
    }

    /**
     * Resolves a card by exact matching name, or falls back to case-insensitive substring search.
     */
    public Optional<Card> lookupCard(String name) {
        Optional<Card> cardOpt = cardRepository.findByName(name.trim());
        if (cardOpt.isEmpty()) {
            List<Card> fallbacks = cardRepository.findByNameContainingIgnoreCase(name.trim());
            if (!fallbacks.isEmpty()) {
                cardOpt = Optional.of(fallbacks.get(0));
            }
        }
        return cardOpt;
    }

    public record ResolvedCardEntry(Card card, String section, int quantity) {}
}
