package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.CardResponseDto;
import com.deck.lab.backend.model.Card;

/**
 * Mapper component that translates between {@link Card} database entities and
 * {@link CardResponseDto} DTO records.
 */
@Component
public class CardMapper {

    /**
     * Translates a {@link Card} database entity to a {@link CardResponseDto} API representation.
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
        dto.setType(card.getType());
        dto.setDescription(card.getDescription());
        dto.setRace(card.getRace());
        dto.setAttribute(card.getAttribute());
        dto.setArchetype(card.getArchetype());
        dto.setImageUrl(card.getImageUrl());
        dto.setImageUrlCropped(card.getImageUrlCropped());
        dto.setFrameType(card.getFrameType());
        dto.setAtk(card.getAtk());
        dto.setDef(card.getDef());
        dto.setLevel(card.getLevel());
        dto.setLinkVal(card.getLinkVal());
        dto.setScale(card.getScale());
        return dto;
    }

    /**
     * Converts a {@link CardResponseDto} API payload into a new transient {@link Card} database
     * entity.
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
        card.setType(dto.getType());
        card.setDescription(dto.getDescription());
        card.setRace(dto.getRace());
        card.setAttribute(dto.getAttribute());
        card.setArchetype(dto.getArchetype());
        card.setImageUrl(dto.getImageUrl());
        card.setImageUrlCropped(dto.getImageUrlCropped());
        card.setFrameType(dto.getFrameType());
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
     *
     * @param dto  incoming updated DTO parameters
     * @param card the existing database entity instance to modify
     */
    public void updateEntityFromDto(CardResponseDto dto, Card card) {
        if (dto == null || card == null) {
            return;
        }
        card.setName(dto.getName());
        card.setType(dto.getType());
        card.setDescription(dto.getDescription());
        card.setRace(dto.getRace());
        card.setAttribute(dto.getAttribute());
        card.setArchetype(dto.getArchetype());
        card.setImageUrl(dto.getImageUrl());
        card.setImageUrlCropped(dto.getImageUrlCropped());
        card.setFrameType(dto.getFrameType());
        card.setAtk(dto.getAtk());
        card.setDef(dto.getDef());
        card.setLevel(dto.getLevel());
        card.setLinkVal(dto.getLinkVal());
        card.setScale(dto.getScale());
    }
}
