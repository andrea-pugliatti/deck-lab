package com.deck.lab.backend.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;

class DeckCardMapperTest {

    private DeckCardMapper deckCardMapper;

    @BeforeEach
    void setUp() {
        deckCardMapper = new DeckCardMapper();
    }

    @Test
    void toDto_withValidDeckCard_mapsAllFieldsCorrectly() {
        Deck deck = new Deck();
        deck.setId(1L);

        Card card = new Card();
        card.setId(10L);
        card.setName("Dark Magician");
        card.setType(CardType.NORMAL_MONSTER);
        card.setDescription("The ultimate wizard.");
        card.setRace(CardRace.SPELLCASTER);
        card.setAttribute(CardAttribute.DARK);
        card.setArchetype("Dark Magician");
        card.setImageUrl("images/10.jpg");

        DeckCard deckCard = new DeckCard(deck, card, DeckSection.MAIN, 3);
        deckCard.setId(100L);

        DeckCardDto dto = deckCardMapper.toDto(deckCard);

        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals(10L, dto.getCardId());
        assertEquals("Dark Magician", dto.getName());
        assertEquals("Normal Monster", dto.getType());
        assertEquals("The ultimate wizard.", dto.getDescription());
        assertEquals("Spellcaster", dto.getRace());
        assertEquals("DARK", dto.getAttribute());
        assertEquals("Dark Magician", dto.getArchetype());
        assertEquals("images/10.jpg", dto.getImageUrl());
        assertEquals("MAIN", dto.getSection());
        assertEquals(3, dto.getQuantity());
    }

    @Test
    void toDto_withNullCard_mapsWithoutCardInfo() {
        DeckCard deckCard = new DeckCard(null, null, DeckSection.SIDE, 1);
        deckCard.setId(200L);

        DeckCardDto dto = deckCardMapper.toDto(deckCard);

        assertNotNull(dto);
        assertEquals(200L, dto.getId());
        assertNull(dto.getCardId());
        assertNull(dto.getName());
        assertEquals("SIDE", dto.getSection());
        assertEquals(1, dto.getQuantity());
    }

    @Test
    void toDto_withNullDeckCard_returnsNull() {
        assertNull(deckCardMapper.toDto(null));
    }

    @Test
    void toEntity_withValidDto_mapsFieldsCorrectly() {
        Deck deck = new Deck();
        Card card = new Card();
        DeckCardDto dto = new DeckCardDto(300L, 10L, "Dark Magician", "Normal Monster", "The ultimate wizard.",
                "Spellcaster", "DARK", "Dark Magician", "images/10.jpg", "main", 3);

        DeckCard deckCard = deckCardMapper.toEntity(dto, deck, card);

        assertNotNull(deckCard);
        assertEquals(300L, deckCard.getId());
        assertSame(deck, deckCard.getDeck());
        assertSame(card, deckCard.getCard());
        assertEquals(DeckSection.MAIN, deckCard.getSection()); // Should be capitalized by mapper
        assertEquals(3, deckCard.getQuantity());
    }

    @Test
    void toEntity_withNullDto_returnsNull() {
        assertNull(deckCardMapper.toEntity(null, new Deck(), new Card()));
    }
}
