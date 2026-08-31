package com.deck.lab.backend.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.request.CardSaveRequestDto;
import com.deck.lab.backend.dto.response.CardResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

@DisplayName("CardMapper Unit Tests")
class CardMapperTest {

    private CardMapper cardMapper;

    @BeforeEach
    void setUp() {
        cardMapper = new CardMapper();
    }

    @Test
    @DisplayName("toDto should map all Card entity fields into CardResponseDto")
    void toDto_should_mapAllFields_when_cardIsValid() {
        Card card = new Card();
        card.setId(10L);
        card.setPasscode(46986414L);
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

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(card.getId());
        assertThat(dto.getPasscode()).isEqualTo(card.getPasscode());
        assertThat(dto.getName()).isEqualTo(card.getName());
        assertThat(dto.getType()).isEqualTo(card.getType());
        assertThat(dto.getDescription()).isEqualTo(card.getDescription());
        assertThat(dto.getRace()).isEqualTo(card.getRace());
        assertThat(dto.getAttribute()).isEqualTo(card.getAttribute());
        assertThat(dto.getArchetype()).isEqualTo(card.getArchetype());
        assertThat(dto.getImageUrl()).isEqualTo(card.getImageUrl());
        assertThat(dto.getImageUrlCropped()).isEqualTo(card.getImageUrlCropped());
        assertThat(dto.getFrameType()).isEqualTo(card.getFrameType());
        assertThat(dto.getAtk()).isEqualTo(card.getAtk());
        assertThat(dto.getDef()).isEqualTo(card.getDef());
        assertThat(dto.getLevel()).isEqualTo(card.getLevel());
        assertThat(dto.getLinkVal()).isEqualTo(card.getLinkVal());
        assertThat(dto.getScale()).isEqualTo(card.getScale());
    }

    @Test
    @DisplayName("toDto should return null when card entity is null")
    void toDto_should_returnNull_when_cardIsNull() {
        assertThat(cardMapper.toDto(null)).isNull();
    }

    @Test
    @DisplayName("toEntity should map all CardSaveRequestDto fields into Card entity")
    void toEntity_should_mapAllFields_when_dtoIsValid() {
        CardSaveRequestDto dto = new CardSaveRequestDto();
        dto.setPasscode(46986414L);
        dto.setName("Dark Magician");
        dto.setType(CardType.NORMAL_MONSTER);
        dto.setDescription("The ultimate wizard in terms of attack and defense.");
        dto.setRace(CardRace.SPELLCASTER);
        dto.setAttribute(CardAttribute.DARK);
        dto.setArchetype("Dark Magician");
        dto.setImageUrl("/cards/images/2.jpg");
        dto.setImageUrlCropped("/cards/images/cropped/2.jpg");
        dto.setFrameType(FrameType.NORMAL);
        dto.setAtk(2500);
        dto.setDef(2100);
        dto.setLevel(7);
        dto.setLinkVal(0);
        dto.setScale(0);

        Card card = cardMapper.toEntity(dto);

        assertThat(card).isNotNull();
        assertThat(card.getPasscode()).isEqualTo(dto.getPasscode());
        assertThat(card.getName()).isEqualTo(dto.getName());
        assertThat(card.getType()).isEqualTo(CardType.NORMAL_MONSTER);
        assertThat(card.getDescription()).isEqualTo(dto.getDescription());
        assertThat(card.getRace()).isEqualTo(CardRace.SPELLCASTER);
        assertThat(card.getAttribute()).isEqualTo(CardAttribute.DARK);
        assertThat(card.getArchetype()).isEqualTo(dto.getArchetype());
        assertThat(card.getImageUrl()).isEqualTo(dto.getImageUrl());
        assertThat(card.getImageUrlCropped()).isEqualTo(dto.getImageUrlCropped());
        assertThat(card.getFrameType()).isEqualTo(FrameType.NORMAL);
        assertThat(card.getAtk()).isEqualTo(dto.getAtk());
        assertThat(card.getDef()).isEqualTo(dto.getDef());
        assertThat(card.getLevel()).isEqualTo(dto.getLevel());
        assertThat(card.getLinkVal()).isEqualTo(dto.getLinkVal());
        assertThat(card.getScale()).isEqualTo(dto.getScale());
    }

    @Test
    @DisplayName("toEntity should return null when DTO is null")
    void toEntity_should_returnNull_when_dtoIsNull() {
        assertThat(cardMapper.toEntity(null)).isNull();
    }

    @Test
    @DisplayName("updateEntityFromDto should update existing Card entity fields while preserving identity")
    void updateEntityFromDto_should_updateFields_when_dtoAndCardProvided() {
        Card card = new Card();
        card.setId(20L);
        card.setPasscode(12345678L);
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

        CardSaveRequestDto dto = new CardSaveRequestDto();
        dto.setPasscode(87654321L);
        dto.setName("Red-Eyes Black Dragon Updated");
        dto.setType(CardType.EFFECT_MONSTER);
        dto.setDescription("Updated desc");
        dto.setRace(CardRace.DRAGON);
        dto.setAttribute(CardAttribute.FIRE);
        dto.setArchetype("Red-Eyes / Slash");
        dto.setImageUrl("/cards/images/3_updated.jpg");
        dto.setImageUrlCropped("/cards/images/cropped/3_updated.jpg");
        dto.setFrameType(FrameType.EFFECT);
        dto.setAtk(2500);
        dto.setDef(2100);
        dto.setLevel(8);
        dto.setLinkVal(1);
        dto.setScale(2);

        cardMapper.updateEntityFromDto(dto, card);

        // ID should NOT be updated by updateEntityFromDto method (remains 20L)
        assertThat(card.getId()).isEqualTo(20L);

        // Other fields should be updated
        assertThat(card.getPasscode()).isEqualTo(dto.getPasscode());
        assertThat(card.getName()).isEqualTo(dto.getName());
        assertThat(card.getType()).isEqualTo(CardType.EFFECT_MONSTER);
        assertThat(card.getDescription()).isEqualTo(dto.getDescription());
        assertThat(card.getRace()).isEqualTo(CardRace.DRAGON);
        assertThat(card.getAttribute()).isEqualTo(CardAttribute.FIRE);
        assertThat(card.getArchetype()).isEqualTo(dto.getArchetype());
        assertThat(card.getImageUrl()).isEqualTo(dto.getImageUrl());
        assertThat(card.getImageUrlCropped()).isEqualTo(dto.getImageUrlCropped());
        assertThat(card.getFrameType()).isEqualTo(FrameType.EFFECT);
        assertThat(card.getAtk()).isEqualTo(dto.getAtk());
        assertThat(card.getDef()).isEqualTo(dto.getDef());
        assertThat(card.getLevel()).isEqualTo(dto.getLevel());
        assertThat(card.getLinkVal()).isEqualTo(dto.getLinkVal());
        assertThat(card.getScale()).isEqualTo(dto.getScale());
    }

    @Test
    @DisplayName("updateEntityFromDto should handle null arguments gracefully without throwing exceptions")
    void updateEntityFromDto_should_handleNullsGracefully() {
        Card card = new Card();
        cardMapper.updateEntityFromDto(null, card);
        cardMapper.updateEntityFromDto(new CardSaveRequestDto(), null);
        cardMapper.updateEntityFromDto(null, null);
    }
}
