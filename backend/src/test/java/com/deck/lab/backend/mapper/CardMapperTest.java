package com.deck.lab.backend.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.response.CardResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

class CardMapperTest {

    private CardMapper cardMapper;

    @BeforeEach
    void setUp() {
        cardMapper = new CardMapper();
    }

    @Test
    void toDto_withValidCard_mapsAllFields() {
        Card card = new Card();
        card.setId(10L);
        card.setName("Blue-Eyes White Dragon");
        card.setType(CardType.NORMAL_MONSTER);
        card.setDescription("This legendary dragon is a powerful engine of destruction.");
        card.setRace(CardRace.DRAGON);
        card.setAttribute(CardAttribute.LIGHT);
        card.setArchetype("Blue-Eyes");
        card.setImageUrl("/cards/images/1.jpg");
        card.setImageUrlCropped("/cards/images/cropped/1.jpg");
        card.setFrameType(FrameType.NORMAL);
        card.setAtk(3000);
        card.setDef(2500);
        card.setLevel(8);
        card.setLinkVal(0);
        card.setScale(0);

        CardResponseDto dto = cardMapper.toDto(card);

        assertNotNull(dto);
        assertEquals(card.getId(), dto.getId());
        assertEquals(card.getName(), dto.getName());
        assertEquals(card.getType().getValue(), dto.getType());
        assertEquals(card.getDescription(), dto.getDescription());
        assertEquals(card.getRace().getValue(), dto.getRace());
        assertEquals(card.getAttribute().getValue(), dto.getAttribute());
        assertEquals(card.getArchetype(), dto.getArchetype());
        assertEquals(card.getImageUrl(), dto.getImageUrl());
        assertEquals(card.getImageUrlCropped(), dto.getImageUrlCropped());
        assertEquals(card.getFrameType().getValue(), dto.getFrameType());
        assertEquals(card.getAtk(), dto.getAtk());
        assertEquals(card.getDef(), dto.getDef());
        assertEquals(card.getLevel(), dto.getLevel());
        assertEquals(card.getLinkVal(), dto.getLinkVal());
        assertEquals(card.getScale(), dto.getScale());
    }

    @Test
    void toDto_withNullCard_returnsNull() {
        assertNull(cardMapper.toDto(null));
    }

    @Test
    void toEntity_withValidDto_mapsAllFields() {
        CardResponseDto dto = new CardResponseDto();
        dto.setId(15L);
        dto.setName("Dark Magician");
        dto.setType("Normal Monster");
        dto.setDescription("The ultimate wizard in terms of attack and defense.");
        dto.setRace("Spellcaster");
        dto.setAttribute("DARK");
        dto.setArchetype("Dark Magician");
        dto.setImageUrl("/cards/images/2.jpg");
        dto.setImageUrlCropped("/cards/images/cropped/2.jpg");
        dto.setFrameType("normal");
        dto.setAtk(2500);
        dto.setDef(2100);
        dto.setLevel(7);
        dto.setLinkVal(0);
        dto.setScale(0);

        Card card = cardMapper.toEntity(dto);

        assertNotNull(card);
        assertEquals(dto.getId(), card.getId());
        assertEquals(dto.getName(), card.getName());
        assertEquals(CardType.NORMAL_MONSTER, card.getType());
        assertEquals(dto.getDescription(), card.getDescription());
        assertEquals(CardRace.SPELLCASTER, card.getRace());
        assertEquals(CardAttribute.DARK, card.getAttribute());
        assertEquals(dto.getArchetype(), card.getArchetype());
        assertEquals(dto.getImageUrl(), card.getImageUrl());
        assertEquals(dto.getImageUrlCropped(), card.getImageUrlCropped());
        assertEquals(FrameType.NORMAL, card.getFrameType());
        assertEquals(dto.getAtk(), card.getAtk());
        assertEquals(dto.getDef(), card.getDef());
        assertEquals(dto.getLevel(), card.getLevel());
        assertEquals(dto.getLinkVal(), card.getLinkVal());
        assertEquals(dto.getScale(), card.getScale());
    }

    @Test
    void toEntity_withNullDto_returnsNull() {
        assertNull(cardMapper.toEntity(null));
    }

    @Test
    void updateEntityFromDto_updatesFieldsCorrectly() {
        Card card = new Card();
        card.setId(20L);
        card.setName("Red-Eyes Black Dragon");
        card.setType(CardType.NORMAL_MONSTER);
        card.setDescription("A ferocious dragon with a deadly attack.");
        card.setRace(CardRace.DRAGON);
        card.setAttribute(CardAttribute.DARK);
        card.setArchetype("Red-Eyes");
        card.setImageUrl("/cards/images/3.jpg");
        card.setImageUrlCropped("/cards/images/cropped/3.jpg");
        card.setFrameType(FrameType.NORMAL);
        card.setAtk(2400);
        card.setDef(2000);
        card.setLevel(7);

        CardResponseDto dto = new CardResponseDto();
        dto.setName("Red-Eyes Black Dragon Updated");
        dto.setType("Effect Monster");
        dto.setDescription("Updated desc");
        dto.setRace("Dragon");
        dto.setAttribute("FIRE");
        dto.setArchetype("Red-Eyes / Slash");
        dto.setImageUrl("/cards/images/3_updated.jpg");
        dto.setImageUrlCropped("/cards/images/cropped/3_updated.jpg");
        dto.setFrameType("effect");
        dto.setAtk(2500);
        dto.setDef(2100);
        dto.setLevel(8);
        dto.setLinkVal(1);
        dto.setScale(2);

        cardMapper.updateEntityFromDto(dto, card);

        // ID should NOT be updated by updateEntityFromDto method (remains 20L)
        assertEquals(20L, card.getId());

        // Other fields should be updated
        assertEquals(dto.getName(), card.getName());
        assertEquals(CardType.EFFECT_MONSTER, card.getType());
        assertEquals(dto.getDescription(), card.getDescription());
        assertEquals(CardRace.DRAGON, card.getRace());
        assertEquals(CardAttribute.FIRE, card.getAttribute());
        assertEquals(dto.getArchetype(), card.getArchetype());
        assertEquals(dto.getImageUrl(), card.getImageUrl());
        assertEquals(dto.getImageUrlCropped(), card.getImageUrlCropped());
        assertEquals(FrameType.EFFECT, card.getFrameType());
        assertEquals(dto.getAtk(), card.getAtk());
        assertEquals(dto.getDef(), card.getDef());
        assertEquals(dto.getLevel(), card.getLevel());
        assertEquals(dto.getLinkVal(), card.getLinkVal());
        assertEquals(dto.getScale(), card.getScale());
    }

    @Test
    void updateEntityFromDto_withNullParams_doesNotThrow() {
        Card card = new Card();
        // Should handle null gracefully
        cardMapper.updateEntityFromDto(null, card);
        cardMapper.updateEntityFromDto(new CardResponseDto(), null);
        cardMapper.updateEntityFromDto(null, null);
    }
}
