package com.deck.lab.backend.mapper;

import java.util.ArrayList;
import java.util.List;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;

import org.springframework.stereotype.Component;

@Component
public class DeckMapper {

    public DeckDto toDto(Deck deck) {
        List<DeckCardDto> cardDtos = new ArrayList<>();
        for (DeckCard dc : deck.getDeckCards()) {
            Card c = dc.getCard();
            cardDtos.add(new DeckCardDto(
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
                    dc.getQuantity()));
        }
        DeckDto dto = new DeckDto(deck.getId(), deck.getName(), deck.getDescription(), deck.getFormatName(),
                cardDtos);
        dto.setUpdatedAt(deck.getUpdatedAt());
        return dto;
    }
}