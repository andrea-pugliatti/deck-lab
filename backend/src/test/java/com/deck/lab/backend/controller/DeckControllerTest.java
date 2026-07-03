package com.deck.lab.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.UserRepository;

import tools.jackson.databind.ObjectMapper;

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
    private List<Card> testCards;
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

        testCards = new ArrayList<>();
        for (int i = 1; i <= 15; i++) {
            Card card = new Card();
            card.setName("ControllerTest Card " + i);
            card.setType(CardType.NORMAL_MONSTER);
            card.setFrameType(FrameType.NORMAL);
            card.setDescription("A test card for controller " + i);
            card.setRace(CardRace.DRAGON);
            card.setAttribute(CardAttribute.LIGHT);
            card.setAtk(1000);
            card.setDef(1000);
            card.setLevel(4);
            card = cardRepository.save(card);
            testCards.add(card);
        }
        testCard = testCards.get(0);

        testDeck = new Deck("ControllerTest Deck", "A test deck for controller", Format.TCG, testUser);
        DeckCard dc = new DeckCard(testDeck, testCard, DeckSection.MAIN, 3);
        testDeck.setDeckCards(new ArrayList<>(List.of(dc)));
        testDeck = deckRepository.save(testDeck);
    }

    @Test
    void testGetAllDecks() throws Exception {
        mockMvc.perform(get("/api/decks?username=" + testUser.getUsername())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("ControllerTest Deck")));
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
    void testGetDeckByIdPublicly() throws Exception {
        mockMvc.perform(get("/api/decks/" + testDeck.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("ControllerTest Deck")))
                .andExpect(jsonPath("$.formatName", is("TCG")));
    }

    @Test
    void testGetDeckByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/decks/999999")
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    private List<DeckCardDto> createValidDeckCards() {
        List<DeckCardDto> cardDtos = new ArrayList<>();
        for (int i = 0; i < 14; i++) {
            DeckCardDto cardDto = new DeckCardDto();
            cardDto.setCardId(testCards.get(i).getId());
            cardDto.setSection("MAIN");
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Test
    void testCreateDeck() throws Exception {
        DeckResponseDto newDeckDto = new DeckResponseDto();
        newDeckDto.setName("New Deck");
        newDeckDto.setFormatName("Goat");
        newDeckDto.setDescription("MockMvc test creation");
        newDeckDto.setDeckCards(createValidDeckCards());

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
        DeckResponseDto invalidDto = new DeckResponseDto();
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
    void testValidateDeckSuccess() throws Exception {
        DeckResponseDto validDto = new DeckResponseDto();
        validDto.setName("Valid Deck");
        validDto.setFormatName("Goat");
        validDto.setDescription("Validation success test");
        validDto.setDeckCards(createValidDeckCards());

        mockMvc.perform(post("/api/decks/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testValidateDeckFailure() throws Exception {
        DeckResponseDto invalidDto = new DeckResponseDto();
        invalidDto.setName(""); // Blank name is invalid
        invalidDto.setFormatName("TCG");

        mockMvc.perform(post("/api/decks/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateDeckAuthorized() throws Exception {
        List<DeckCardDto> cardDtos = new ArrayList<>();
        DeckCardDto sideCard = new DeckCardDto();
        sideCard.setCardId(testCards.get(0).getId());
        sideCard.setSection("SIDE");
        sideCard.setQuantity(1);
        cardDtos.add(sideCard);

        for (int i = 1; i <= 14; i++) {
            DeckCardDto mainCard = new DeckCardDto();
            mainCard.setCardId(testCards.get(i).getId());
            mainCard.setSection("MAIN");
            mainCard.setQuantity(3);
            cardDtos.add(mainCard);
        }

        DeckResponseDto updateDto = new DeckResponseDto();
        updateDto.setName("ControllerTest Deck Updated");
        updateDto.setFormatName("Edison");
        updateDto.setDescription("Updated desc");
        updateDto.setDeckCards(cardDtos);

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
        DeckResponseDto updateDto = new DeckResponseDto();
        updateDto.setName("Hacked Deck");
        updateDto.setFormatName("TCG");
        updateDto.setDeckCards(createValidDeckCards());

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
