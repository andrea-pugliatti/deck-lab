package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.CardDTO;
import com.deck.lab.backend.model.Card;

@Component
public class CardMapper {

    public CardDTO toDto(Card card) {
        if (card == null) {
            return null;
        }
        CardDTO dto = new CardDTO();
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

    public Card toEntity(CardDTO dto) {
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

    public void updateEntityFromDto(CardDTO dto, Card card) {
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
