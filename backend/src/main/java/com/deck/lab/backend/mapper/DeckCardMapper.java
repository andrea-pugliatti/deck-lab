package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;

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
                    dc.getSection(),
                    dc.getQuantity()
            );
        }
        return new DeckCardDto(
                dc.getId(),
                c.getId(),
                c.getName(),
                c.getType(),
                c.getDescription(),
                c.getRace(),
                c.getAttribute(),
                c.getArchetype(),
                c.getImageUrl(),
                dc.getSection(),
                dc.getQuantity());
    }

    public DeckCard toEntity(DeckCardDto dto, Deck deck, Card card) {
        if (dto == null) {
            return null;
        }
        DeckCard dc = new DeckCard(deck, card, dto.getSection() != null ? dto.getSection().toUpperCase() : null, dto.getQuantity());
        dc.setId(dto.getId());
        return dc;
    }
}
