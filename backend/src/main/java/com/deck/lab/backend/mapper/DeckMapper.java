package com.deck.lab.backend.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.Format;

@Component
public class DeckMapper {

    private final DeckCardMapper deckCardMapper;

    public DeckMapper(DeckCardMapper deckCardMapper) {
        this.deckCardMapper = deckCardMapper;
    }

    public DeckDto toDto(Deck deck) {
        List<DeckCardDto> cardDtos = deck.getDeckCards() != null
                ? deck.getDeckCards().stream().map(deckCardMapper::toDto).toList()
                : new ArrayList<>();
        String formatStr = deck.getFormatName() != null ? deck.getFormatName().getValue() : null;
        DeckDto dto = new DeckDto(deck.getId(), deck.getName(), deck.getDescription(), formatStr,
                cardDtos);
        dto.setUpdatedAt(deck.getUpdatedAt());
        if (deck.getUser() != null) {
            dto.setCreatorUsername(deck.getUser().getUsername());
        }
        return dto;
    }

    public Deck toEntity(DeckDto dto) {
        if (dto == null) {
            return null;
        }
        Deck deck = new Deck();
        deck.setId(dto.getId());
        deck.setName(dto.getName());
        deck.setDescription(dto.getDescription());
        try {
            deck.setFormatName(dto.getFormatName() != null ? Format.fromString(dto.getFormatName()) : null);
        } catch (IllegalArgumentException e) {
            deck.setFormatName(null);
        }
        return deck;
    }

    public void updateEntityFromDto(DeckDto dto, Deck deck) {
        if (dto == null || deck == null) {
            return;
        }
        deck.setName(dto.getName());
        deck.setDescription(dto.getDescription());
        try {
            deck.setFormatName(dto.getFormatName() != null ? Format.fromString(dto.getFormatName()) : null);
        } catch (IllegalArgumentException e) {
            deck.setFormatName(null);
        }
    }
}