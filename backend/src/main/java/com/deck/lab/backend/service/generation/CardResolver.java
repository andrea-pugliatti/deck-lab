package com.deck.lab.backend.service.generation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.service.generation.model.CardEntry;
import com.deck.lab.backend.service.generation.model.ResolvedCardEntry;

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
    public List<ResolvedCardEntry> resolveCards(List<CardEntry> entries) {
        List<ResolvedCardEntry> resolved = new ArrayList<>();
        if (entries == null || entries.isEmpty()) {
            return resolved;
        }

        List<String> names = entries.stream()
                .filter(e -> e != null && e.getName() != null && !e.getName().isBlank())
                .map(e -> e.getName().trim())
                .distinct()
                .toList();

        Map<String, Card> cardMap = new HashMap<>();
        if (!names.isEmpty()) {
            List<Card> foundCards = cardRepository.findByNameIn(names);
            if (foundCards != null) {
                for (Card c : foundCards) {
                    if (c != null && c.getName() != null) {
                        cardMap.put(c.getName().trim().toLowerCase(), c);
                    }
                }
            }
        }

        for (CardEntry entry : entries) {
            if (entry == null || entry.getName() == null || entry.getName().isBlank()) {
                continue;
            }

            String trimmed = entry.getName().trim();
            Card card = cardMap.get(trimmed.toLowerCase());
            if (card == null) {
                Optional<Card> dbCardOpt = lookupCard(trimmed);
                if (dbCardOpt.isPresent()) {
                    card = dbCardOpt.get();
                }
            }

            if (card != null) {
                DeckSection section = entry.getSection() != null
                        ? entry.getSection()
                        : DeckSection.MAIN;

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
    public List<CardSuggestionResponseDto>
            resolveSuggestions(List<CardSuggestionResponseDto> suggestions) {
        List<CardSuggestionResponseDto> resolved = new ArrayList<>();
        if (suggestions == null || suggestions.isEmpty()) {
            return resolved;
        }

        List<String> names = suggestions.stream()
                .filter(s -> s != null && s.getName() != null && !s.getName().isBlank())
                .map(s -> s.getName().trim())
                .distinct()
                .toList();

        Map<String, Card> cardMap = new HashMap<>();
        if (!names.isEmpty()) {
            List<Card> foundCards = cardRepository.findByNameIn(names);
            if (foundCards != null) {
                for (Card c : foundCards) {
                    if (c != null && c.getName() != null) {
                        cardMap.put(c.getName().trim().toLowerCase(), c);
                    }
                }
            }
        }

        for (CardSuggestionResponseDto suggestion : suggestions) {
            if (suggestion.getName() == null || suggestion.getName().isBlank()) {
                continue;
            }

            String trimmed = suggestion.getName().trim();
            Card card = cardMap.get(trimmed.toLowerCase());
            if (card == null) {
                Optional<Card> dbCardOpt = lookupCard(trimmed);
                if (dbCardOpt.isPresent()) {
                    card = dbCardOpt.get();
                }
            }

            if (card != null) {
                resolved.add(new CardSuggestionResponseDto(card.getName(),
                        suggestion.getSection() != null
                                ? suggestion.getSection()
                                : DeckSection.MAIN,
                        suggestion.getSynergyReason() != null
                                ? suggestion.getSynergyReason()
                                : "Provides good synergy.",
                        card.getId(),
                        card.getType(),
                        card.getImageUrlCropped()));
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
}
