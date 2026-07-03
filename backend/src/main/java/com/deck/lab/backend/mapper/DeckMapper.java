package com.deck.lab.backend.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.Format;

/**
 * Mapper component that translates between {@link Deck} JPA Entities and
 * {@link DeckResponseDto} Data Transfer Objects.
 * 
 * <p>
 * <b>Mapper Pattern:</b>
 * Database entities (like {@code Deck}) map directly to SQL tables and column
 * definitions. However, exposing database classes directly to API clients is
 * dangerous (it leaks database structure and makes schema refactoring
 * difficult). This class solves that by mapping entities to decoupled DTOs
 * (like {@code DeckDto}) which define the exact API payload format expected by
 * the frontend.
 * 
 * <p>
 * Annotated with {@link Component} so Spring automatically manages its
 * lifecycle and makes it available for injection in other services.
 * </p>
 */
@Component
public class DeckMapper {

    private final DeckCardMapper deckCardMapper;

    public DeckMapper(DeckCardMapper deckCardMapper) {
        this.deckCardMapper = deckCardMapper;
    }

    /**
     * Maps a {@link Deck} database entity to an API-friendly
     * {@link DeckResponseDto}.
     * Translates child entity relations and resolves format names.
     *
     * @param deck the database-managed Deck entity
     * @return the populated DeckDto representation
     */
    public DeckResponseDto toDto(Deck deck) {
        List<DeckCardDto> cardDtos = deck.getDeckCards() != null
                ? deck.getDeckCards().stream().map(deckCardMapper::toDto).toList()
                : new ArrayList<>();
        String formatStr = deck.getFormatName() != null ? deck.getFormatName().getValue() : null;
        DeckResponseDto dto = new DeckResponseDto(deck.getId(), deck.getName(), deck.getDescription(), formatStr,
                cardDtos);
        dto.setUpdatedAt(deck.getUpdatedAt());
        if (deck.getUser() != null) {
            dto.setCreatorUsername(deck.getUser().getUsername());
        }
        return dto;
    }

    /**
     * Converts a incoming {@link DeckResponseDto} payload into a new {@link Deck}
     * JPA
     * entity.
     * Safe-handles invalid format strings.
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
        try {
            deck.setFormatName(dto.getFormatName() != null ? Format.fromString(dto.getFormatName()) : null);
        } catch (IllegalArgumentException e) {
            deck.setFormatName(null);
        }
        return deck;
    }

    /**
     * Updates an existing database-managed {@link Deck} entity with new parameters
     * from a request DTO, preserving database primary keys and references.
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
        try {
            deck.setFormatName(dto.getFormatName() != null ? Format.fromString(dto.getFormatName()) : null);
        } catch (IllegalArgumentException e) {
            deck.setFormatName(null);
        }
    }
}