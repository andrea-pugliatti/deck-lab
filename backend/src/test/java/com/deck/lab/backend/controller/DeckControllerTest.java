package com.deck.lab.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.UserRepository;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private User unauthorizedUser;
    private Card testCard;
    private Deck testDeck;
    private UsernamePasswordAuthenticationToken testUserAuth;
    private UsernamePasswordAuthenticationToken unauthorizedUserAuth;

    @BeforeEach
    void setUp() {
        testUser = new User("controller-deck-user-1", "password", "ctrl-deck-user-1@example.com");
        testUser = userRepository.save(testUser);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList());

        unauthorizedUser = new User("controller-deck-user-2", "password", "ctrl-deck-user-2@example.com");
        unauthorizedUser = userRepository.save(unauthorizedUser);
        unauthorizedUserAuth = new UsernamePasswordAuthenticationToken(unauthorizedUser, null, Collections.emptyList());

        testCard = new Card();
        testCard.setName("ControllerTest Card");
        testCard.setType("Normal Monster");
        testCard.setFrameType("normal");
        testCard.setDescription("A test card for controller.");
        testCard.setRace("Dragon");
        testCard.setAttribute("LIGHT");
        testCard.setAtk(1000);
        testCard.setDef(1000);
        testCard.setLevel(4);
        testCard = cardRepository.save(testCard);

        testDeck = new Deck("ControllerTest Deck", "A test deck for controller", "TCG", testUser);
        DeckCard dc = new DeckCard(testDeck, testCard, "MAIN", 3);
        testDeck.setDeckCards(new ArrayList<>(List.of(dc)));
        testDeck = deckRepository.save(testDeck);
    }

    @Test
    void testGetAllDecks() throws Exception {
        mockMvc.perform(get("/api/decks")
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("ControllerTest Deck")));
    }

    @Test
    void testGetDeckByIdAuthorized() throws Exception {
        mockMvc.perform(get("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("ControllerTest Deck")))
                .andExpect(jsonPath("$.formatName", is("TCG")))
                .andExpect(jsonPath("$.deckCards", hasSize(1)))
                .andExpect(jsonPath("$.deckCards[0].cardId", is(testCard.getId().intValue())));
    }

    @Test
    void testGetDeckByIdUnauthorized() throws Exception {
        mockMvc.perform(get("/api/decks/" + testDeck.getId())
                .with(authentication(unauthorizedUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetDeckByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/decks/999999")
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateDeck() throws Exception {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(testCard.getId());
        cardDto.setSection("MAIN");
        cardDto.setQuantity(3);

        DeckDto newDeckDto = new DeckDto();
        newDeckDto.setName("New Deck");
        newDeckDto.setFormatName("Goat");
        newDeckDto.setDescription("MockMvc test creation");
        newDeckDto.setDeckCards(List.of(cardDto));

        mockMvc.perform(post("/api/decks")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newDeckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("New Deck")))
                .andExpect(jsonPath("$.formatName", is("Goat")));
    }

    @Test
    void testCreateDeckInvalidValidation() throws Exception {
        DeckDto invalidDto = new DeckDto();
        invalidDto.setName(""); // Blank name is invalid
        invalidDto.setFormatName("TCG");

        mockMvc.perform(post("/api/decks")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateDeckAuthorized() throws Exception {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(testCard.getId());
        cardDto.setSection("SIDE"); // Section updated
        cardDto.setQuantity(1); // Quantity updated

        DeckDto updateDto = new DeckDto();
        updateDto.setName("ControllerTest Deck Updated");
        updateDto.setFormatName("Edison");
        updateDto.setDescription("Updated desc");
        updateDto.setDeckCards(List.of(cardDto));

        mockMvc.perform(put("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("ControllerTest Deck Updated")))
                .andExpect(jsonPath("$.formatName", is("Edison")))
                .andExpect(jsonPath("$.deckCards[0].quantity", is(1)))
                .andExpect(jsonPath("$.deckCards[0].section", is("SIDE")));
    }

    @Test
    void testUpdateDeckUnauthorized() throws Exception {
        DeckDto updateDto = new DeckDto();
        updateDto.setName("Hacked Deck");
        updateDto.setFormatName("TCG");

        mockMvc.perform(put("/api/decks/" + testDeck.getId())
                .with(authentication(unauthorizedUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteDeckAuthorized() throws Exception {
        mockMvc.perform(delete("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth)))
                .andExpect(status().isNoContent());

        // Verify it was actually deleted
        mockMvc.perform(get("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteDeckUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/decks/" + testDeck.getId())
                .with(authentication(unauthorizedUserAuth)))
                .andExpect(status().isNotFound());

        // Verify it was NOT deleted
        mockMvc.perform(get("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth)))
                .andExpect(status().isOk());
    }
}
