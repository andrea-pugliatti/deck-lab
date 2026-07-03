package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.CardResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

/**
 * Mapper component that translates between {@link Card} database entities and
 * {@link CardResponseDto} DTO records.
 *
 * <p>
 * <b>Enums and DTO Mapping:</b>
 * Database columns often store static values as Enums (like {@code CardType} or
 * {@code CardAttribute}). However, API clients communicate in JSON strings.
 * This class orchestrates the parsing of incoming JSON strings into type-safe
 * Java Enums via their {@code fromString()} methods, and converts Enums back to
 * strings for client responses.
 *
 * <p>
 * Annotated with {@link Component} for Spring-managed automatic bean
 * registration.
 * </p>
 */
@Component
public class CardMapper {

    /**
     * Translates a {@link Card} database entity to a {@link CardResponseDto} API
     * representation.
     * Extracts values from Enums into displayable string representations.
     *
     * @param card database-managed Card entity
     * @return the mapped DTO payload, or null if parameter is null
     */
    public CardResponseDto toDto(Card card) {
        if (card == null) {
            return null;
        }
        CardResponseDto dto = new CardResponseDto();
        dto.setId(card.getId());
        dto.setName(card.getName());
        dto.setType(card.getType() != null ? card.getType().getValue() : null);
        dto.setDescription(card.getDescription());
        dto.setRace(card.getRace() != null ? card.getRace().getValue() : null);
        dto.setAttribute(card.getAttribute() != null ? card.getAttribute().getValue() : null);
        dto.setArchetype(card.getArchetype());
        dto.setImageUrl(card.getImageUrl());
        dto.setImageUrlCropped(card.getImageUrlCropped());
        dto.setFrameType(card.getFrameType() != null ? card.getFrameType().getValue() : null);
        dto.setAtk(card.getAtk());
        dto.setDef(card.getDef());
        dto.setLevel(card.getLevel());
        dto.setLinkVal(card.getLinkVal());
        dto.setScale(card.getScale());
        return dto;
    }

    /**
     * Converts a {@link CardResponseDto} API payload into a new transient
     * {@link Card}
     * database entity.
     * Catches and safe-handles exceptions arising from unknown enum values.
     *
     * @param dto input DTO data
     * @return new transient Card entity, or null if parameter is null
     */
    public Card toEntity(CardResponseDto dto) {
        if (dto == null) {
            return null;
        }
        Card card = new Card();
        card.setId(dto.getId());
        card.setName(dto.getName());

        try {
            card.setType(dto.getType() != null ? CardType.fromString(dto.getType()) : null);
        } catch (IllegalArgumentException e) {
            card.setType(null);
        }

        card.setDescription(dto.getDescription());

        try {
            card.setRace(dto.getRace() != null ? CardRace.fromString(dto.getRace()) : null);
        } catch (IllegalArgumentException e) {
            card.setRace(null);
        }

        try {
            card.setAttribute(dto.getAttribute() != null ? CardAttribute.fromString(dto.getAttribute()) : null);
        } catch (IllegalArgumentException e) {
            card.setAttribute(null);
        }

        card.setArchetype(dto.getArchetype());
        card.setImageUrl(dto.getImageUrl());
        card.setImageUrlCropped(dto.getImageUrlCropped());

        try {
            card.setFrameType(dto.getFrameType() != null ? FrameType.fromString(dto.getFrameType()) : null);
        } catch (IllegalArgumentException e) {
            card.setFrameType(null);
        }

        card.setAtk(dto.getAtk());
        card.setDef(dto.getDef());
        card.setLevel(dto.getLevel());
        card.setLinkVal(dto.getLinkVal());
        card.setScale(dto.getScale());
        return card;
    }

    /**
     * Updates an existing database-managed {@link Card} entity with values from a
     * {@link CardResponseDto}.
     * Saves changes directly onto the entity instance reference while safe-handling
     * enum conversion failures.
     *
     * @param dto  incoming updated DTO parameters
     * @param card the existing database entity instance to modify
     */
    public void updateEntityFromDto(CardResponseDto dto, Card card) {
        if (dto == null || card == null) {
            return;
        }
        card.setName(dto.getName());

        try {
            card.setType(dto.getType() != null ? CardType.fromString(dto.getType()) : null);
        } catch (IllegalArgumentException e) {
            card.setType(null);
        }

        card.setDescription(dto.getDescription());

        try {
            card.setRace(dto.getRace() != null ? CardRace.fromString(dto.getRace()) : null);
        } catch (IllegalArgumentException e) {
            card.setRace(null);
        }

        try {
            card.setAttribute(dto.getAttribute() != null ? CardAttribute.fromString(dto.getAttribute()) : null);
        } catch (IllegalArgumentException e) {
            card.setAttribute(null);
        }

        card.setArchetype(dto.getArchetype());
        card.setImageUrl(dto.getImageUrl());
        card.setImageUrlCropped(dto.getImageUrlCropped());

        try {
            card.setFrameType(dto.getFrameType() != null ? FrameType.fromString(dto.getFrameType()) : null);
        } catch (IllegalArgumentException e) {
            card.setFrameType(null);
        }

        card.setAtk(dto.getAtk());
        card.setDef(dto.getDef());
        card.setLevel(dto.getLevel());
        card.setLinkVal(dto.getLinkVal());
        card.setScale(dto.getScale());
    }
}
