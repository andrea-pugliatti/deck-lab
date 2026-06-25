package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;

@Component
public class DeckCardMapper {

    public DeckCardDto toDto(DeckCard dc) {
        if (dc == null) {
            return null;
        }
        Card c = dc.getCard();
        if (c == null) {
            return new DeckCardDto(
                    dc.getId(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    dc.getSection() != null ? dc.getSection().getValue() : null,
                    dc.getQuantity()
            );
        }
        return new DeckCardDto(
                dc.getId(),
                c.getId(),
                c.getName(),
                c.getType() != null ? c.getType().getValue() : null,
                c.getDescription(),
                c.getRace() != null ? c.getRace().getValue() : null,
                c.getAttribute() != null ? c.getAttribute().getValue() : null,
                c.getArchetype(),
                c.getImageUrl(),
                dc.getSection() != null ? dc.getSection().getValue() : null,
                dc.getQuantity());
    }

    public DeckCard toEntity(DeckCardDto dto, Deck deck, Card card) {
        if (dto == null) {
            return null;
        }
        DeckSection sectionEnum = null;
        try {
            sectionEnum = dto.getSection() != null ? DeckSection.fromString(dto.getSection()) : null;
        } catch (IllegalArgumentException e) {
            // Fallback/ignore invalid section
        }
        DeckCard dc = new DeckCard(deck, card, sectionEnum, dto.getQuantity());
        dc.setId(dto.getId());
        return dc;
    }
}
