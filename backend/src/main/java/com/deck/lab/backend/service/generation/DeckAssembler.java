package com.deck.lab.backend.service.generation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.service.generation.model.ResolvedCardEntry;

/**
 * Service mapping resolved card inputs into transient Deck models and data transfer objects.
 */
@Service
public class DeckAssembler {

    /**
     * Assembles a transient Deck domain entity and its nested DeckCards.
     *
     * @param name          deck name
     * @param formatName    target format name
     * @param resolvedCards list of database-resolved cards
     * @return an assembled Deck entity ready for validation or persistence
     */
    public Deck assembleDeck(String name,
                             String formatName,
                             List<ResolvedCardEntry> resolvedCards) {
        Deck deck = new Deck();
        deck.setName(name);

        if (formatName != null && !formatName.isBlank()) {
            try {
                deck.setFormatName(Format.fromString(formatName));
            } catch (IllegalArgumentException e) {
                // Ignore invalid format
            }
        }

        List<DeckCard> deckCards = new ArrayList<>();
        if (resolvedCards != null) {
            for (ResolvedCardEntry entry : resolvedCards) {
                DeckSection sectionEnum = null;
                if (entry.section() != null) {
                    try {
                        sectionEnum = DeckSection.fromString(entry.section());
                    } catch (IllegalArgumentException e) {
                        // Ignore invalid section
                    }
                }
                deckCards.add(new DeckCard(deck, entry.card(), sectionEnum, entry.quantity()));
            }
        }
        deck.setDeckCards(deckCards);
        return deck;
    }

    /**
     * Helper to assemble a transient Deck from raw DTO lists and pre-resolved Card map. Useful for
     * eliminating duplication in validation routines.
     */
    public Deck assembleDeckFromDtos(String name,
                                     String formatName,
                                     List<DeckCardRequestDto> cardDtos,
                                     Map<Long, Card> cardMap) {
        List<ResolvedCardEntry> resolved = new ArrayList<>();
        if (cardDtos != null && cardMap != null) {
            for (DeckCardRequestDto dto : cardDtos) {
                Card card = cardMap.get(dto.getCardId());
                if (card != null) {
                    resolved.add(new ResolvedCardEntry(card, dto.getSection(), dto.getQuantity()));
                }
            }
        }
        return assembleDeck(name, formatName, resolved);
    }

    /**
     * Maps resolved card list to response DTOs.
     *
     * @param resolvedCards list of database resolved cards
     * @return a list of mapped DeckCardDto objects
     */
    public List<DeckCardResponseDto> toDeckCardDtos(List<ResolvedCardEntry> resolvedCards) {
        List<DeckCardResponseDto> dtos = new ArrayList<>();
        if (resolvedCards == null) {
            return dtos;
        }

        long tempIdCounter = 1;
        for (ResolvedCardEntry entry : resolvedCards) {
            Card card = entry.card();
            dtos.add(new DeckCardResponseDto(tempIdCounter++,
                    card.getId(),
                    card.getName(),
                    card.getType() != null
                            ? card.getType().getValue()
                            : null,
                    card.getDescription(),
                    card.getRace() != null
                            ? card.getRace().getValue()
                            : null,
                    card.getAttribute() != null
                            ? card.getAttribute().getValue()
                            : null,
                    card.getArchetype(),
                    card.getImageUrl(),
                    entry.section(),
                    entry.quantity()));
        }
        return dtos;
    }
}
