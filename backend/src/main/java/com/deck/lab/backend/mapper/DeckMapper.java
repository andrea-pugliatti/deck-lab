package com.deck.lab.backend.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;

/**
 * Mapper component that translates between {@link Deck} JPA Entities and {@link DeckResponseDto}
 * Data Transfer Objects.
 */
@Component
public class DeckMapper {

    /**
     * Maps a {@link Deck} database entity to an API-friendly {@link DeckResponseDto}.
     *
     * @param deck the database-managed Deck entity
     * @return the populated DeckDto representation
     */
    public DeckResponseDto toDto(Deck deck) {
        List<DeckCardResponseDto> cardDtos = deck.getDeckCards() != null
                ? deck.getDeckCards().stream()
                        .map(this::toDeckCardDto)
                        .toList()
                : new ArrayList<>();
        DeckResponseDto dto = new DeckResponseDto();
        dto.setId(deck.getId());
        dto.setName(deck.getName());
        dto.setDescription(deck.getDescription());
        dto.setFormatName(deck.getFormatName());
        dto.setUpdatedAt(deck.getUpdatedAt());
        if (deck.getUser() != null) {
            dto.setCreatorUsername(deck.getUser().getUsername());
        }
        dto.setCards(cardDtos);
        return dto;
    }

    /**
     * Converts an incoming {@link DeckResponseDto} payload into a new {@link Deck} JPA entity.
     *
     * @param dto the DTO data received from client API request
     * @return a new transient (unsaved) Deck entity populated with the DTO values
     */
    public Deck toEntity(DeckResponseDto dto) {
        if (dto == null) {
            return null;
        }
        Deck deck = new Deck();
        deck.setId(dto.getId());
        deck.setName(dto.getName());
        deck.setDescription(dto.getDescription());
        deck.setFormatName(dto.getFormatName());
        return deck;
    }

    /**
     * Updates an existing database-managed {@link Deck} entity with new parameters from a request
     * DTO.
     *
     * @param dto  the incoming updated DTO parameters
     * @param deck the existing database entity to update
     */
    public void updateEntityFromDto(DeckResponseDto dto, Deck deck) {
        if (dto == null || deck == null) {
            return;
        }
        deck.setName(dto.getName());
        deck.setDescription(dto.getDescription());
        deck.setFormatName(dto.getFormatName());
    }

    DeckCardResponseDto toDeckCardDto(DeckCard dc) {
        if (dc == null) {
            return null;
        }
        Card c = dc.getCard();
        if (c == null) {
            return new DeckCardResponseDto(dc.getId(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    dc.getSection(),
                    dc.getQuantity());
        }
        return new DeckCardResponseDto(dc.getId(),
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
}