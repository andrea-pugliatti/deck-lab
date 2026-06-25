package com.deck.lab.backend.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.User;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DeckMapperTest {

    private DeckMapper deckMapper;

    @BeforeEach
    void setUp() {
        deckMapper = new DeckMapper(new DeckCardMapper());
    }

    @Test
    void toDto_withValidDeckAndCards_mapsAllFieldsCorrectly() {
        User user = new User("yugi", "password", "yugi@example.com");
        user.setId(1L);

        Deck deck = new Deck();
        deck.setId(10L);
        deck.setName("Yugi's Starter Deck");
        deck.setDescription("A deck loaded with powerful spellcasters and dragons.");
        deck.setFormatName("TCG");
        deck.setUser(user);

        Card card1 = new Card();
        card1.setId(100L);
        card1.setName("Dark Magician");
        card1.setType("Normal Monster");
        card1.setDescription("The ultimate wizard in terms of attack and defense.");
        card1.setRace("Spellcaster");
        card1.setAttribute("DARK");
        card1.setArchetype("Dark Magician");
        card1.setImageUrl("cards/images/100.jpg");

        Card card2 = new Card();
        card2.setId(101L);
        card2.setName("Blue-Eyes White Dragon");
        card2.setType("Normal Monster");
        card2.setDescription("This legendary dragon is a powerful engine of destruction.");
        card2.setRace("Dragon");
        card2.setAttribute("LIGHT");
        card2.setArchetype("Blue-Eyes");
        card2.setImageUrl("cards/images/101.jpg");

        DeckCard dc1 = new DeckCard(deck, card1, "MAIN", 3);
        dc1.setId(500L);

        DeckCard dc2 = new DeckCard(deck, card2, "SIDE", 1);
        dc2.setId(501L);

        deck.setDeckCards(List.of(dc1, dc2));

        DeckDto dto = deckMapper.toDto(deck);

        assertNotNull(dto);
        assertEquals(deck.getId(), dto.getId());
        assertEquals(deck.getName(), dto.getName());
        assertEquals(deck.getDescription(), dto.getDescription());
        assertEquals(deck.getFormatName(), dto.getFormatName());
        assertEquals("yugi", dto.getCreatorUsername());
        
        List<DeckCardDto> cardDtos = dto.getDeckCards();
        assertNotNull(cardDtos);
        assertEquals(2, cardDtos.size());

        DeckCardDto cardDto1 = cardDtos.stream().filter(c -> c.getCardId().equals(100L)).findFirst().orElseThrow();
        assertEquals(500L, cardDto1.getId());
        assertEquals("Dark Magician", cardDto1.getName());
        assertEquals("Normal Monster", cardDto1.getType());
        assertEquals("The ultimate wizard in terms of attack and defense.", cardDto1.getDescription());
        assertEquals("Spellcaster", cardDto1.getRace());
        assertEquals("DARK", cardDto1.getAttribute());
        assertEquals("Dark Magician", cardDto1.getArchetype());
        assertEquals("cards/images/100.jpg", cardDto1.getImageUrl());
        assertEquals("MAIN", cardDto1.getSection());
        assertEquals(3, cardDto1.getQuantity());

        DeckCardDto cardDto2 = cardDtos.stream().filter(c -> c.getCardId().equals(101L)).findFirst().orElseThrow();
        assertEquals(501L, cardDto2.getId());
        assertEquals("Blue-Eyes White Dragon", cardDto2.getName());
        assertEquals("Dragon", cardDto2.getRace());
        assertEquals("LIGHT", cardDto2.getAttribute());
        assertEquals("Blue-Eyes", cardDto2.getArchetype());
        assertEquals("cards/images/101.jpg", cardDto2.getImageUrl());
        assertEquals("SIDE", cardDto2.getSection());
        assertEquals(1, cardDto2.getQuantity());
    }

    @Test
    void toDto_withEmptyDeckCards_returnsDtoWithEmptyList() {
        Deck deck = new Deck("Empty Deck", "No cards inside", "Speed Duel", null);
        deck.setId(20L);
        deck.setDeckCards(new ArrayList<>());

        DeckDto dto = deckMapper.toDto(deck);

        assertNotNull(dto);
        assertEquals(20L, dto.getId());
        assertEquals("Empty Deck", dto.getName());
        assertEquals("No cards inside", dto.getDescription());
        assertEquals("Speed Duel", dto.getFormatName());
        assertNotNull(dto.getDeckCards());
        assertTrue(dto.getDeckCards().isEmpty());
    }

    @Test
    void toEntity_withValidDto_mapsFieldsCorrectly() {
        DeckDto dto = new DeckDto(30L, "New Deck", "Some description", "Advanced", new ArrayList<>());

        Deck deck = deckMapper.toEntity(dto);

        assertNotNull(deck);
        assertEquals(30L, deck.getId());
        assertEquals("New Deck", deck.getName());
        assertEquals("Some description", deck.getDescription());
        assertEquals("Advanced", deck.getFormatName());
    }

    @Test
    void toEntity_withNullDto_returnsNull() {
        assertNull(deckMapper.toEntity(null));
    }

    @Test
    void updateEntityFromDto_withValidDto_updatesFieldsCorrectly() {
        Deck deck = new Deck("Old Name", "Old Desc", "Old Format", null);
        deck.setId(40L);

        DeckDto dto = new DeckDto(50L, "Updated Name", "Updated Desc", "Updated Format", new ArrayList<>());

        deckMapper.updateEntityFromDto(dto, deck);

        assertEquals(40L, deck.getId()); // ID should not be changed by updateEntityFromDto
        assertEquals("Updated Name", deck.getName());
        assertEquals("Updated Desc", deck.getDescription());
        assertEquals("Updated Format", deck.getFormatName());
    }
}
