package com.deck.lab.backend.service.generation;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;

/**
 * Tool function enabling the AI model to query full details (ATK, DEF, effect text, etc.) of a card.
 */
public class CardDetailsTool implements Function<CardDetailsTool.CardDetailsRequest, CardDetailsTool.CardDetailsResponse> {

    private final CardRepository cardRepository;

    public CardDetailsTool(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Override
    public CardDetailsResponse apply(CardDetailsRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return new CardDetailsResponse(null, null, null, "Card name is empty.", null, null, null, null, null, null, null, null, null, null);
        }

        // Try exact match first
        Optional<Card> cardOpt = cardRepository.findByName(request.name().trim());
        if (cardOpt.isEmpty()) {
            // Fallback substring match
            List<Card> fallbacks = cardRepository.findByNameContainingIgnoreCase(request.name().trim());
            if (!fallbacks.isEmpty()) {
                cardOpt = Optional.of(fallbacks.get(0));
            }
        }

        if (cardOpt.isEmpty()) {
            return new CardDetailsResponse(null, null, null, "Card not found: " + request.name(), null, null, null, null, null, null, null, null, null, null);
        }

        Card c = cardOpt.get();
        return new CardDetailsResponse(
                c.getId(),
                c.getName(),
                c.getType() != null ? c.getType().getValue() : null,
                c.getDescription(),
                c.getRace() != null ? c.getRace().getValue() : null,
                c.getAttribute() != null ? c.getAttribute().getValue() : null,
                c.getArchetype(),
                c.getAtk(),
                c.getDef(),
                c.getLevel(),
                c.getLinkVal(),
                c.getScale(),
                c.getImageUrl(),
                c.getImageUrlCropped()
        );
    }

    public record CardDetailsRequest(String name) {}

    public record CardDetailsResponse(
            Long id,
            String name,
            String type,
            String description,
            String race,
            String attribute,
            String archetype,
            Integer atk,
            Integer def,
            Integer level,
            Integer linkVal,
            Integer scale,
            String imageUrl,
            String imageUrlCropped
    ) {}
}
