package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.CardDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

@Component
public class CardMapper {

    public CardDto toDto(Card card) {
        if (card == null) {
            return null;
        }
        CardDto dto = new CardDto();
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

    public Card toEntity(CardDto dto) {
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

    public void updateEntityFromDto(CardDto dto, Card card) {
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
