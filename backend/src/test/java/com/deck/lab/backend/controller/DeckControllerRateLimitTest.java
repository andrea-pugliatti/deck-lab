package com.deck.lab.backend.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
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
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.RateLimiter;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class DeckControllerRateLimitTest {

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

    @Autowired
    @Qualifier("deckValidationRateLimiter")
    private RateLimiter deckValidationRateLimiter;

    @Autowired
    @Qualifier("deckSaveRateLimiter")
    private RateLimiter deckSaveRateLimiter;

    private User testUser;
    private UsernamePasswordAuthenticationToken testUserAuth;
    private List<Card> testCards;
    private Deck testDeck;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) deckValidationRateLimiter).reset();
        ((InMemoryRateLimiter) deckSaveRateLimiter).reset();

        testUser = new User("ctrl-rate-user", "password", "ctrl-rate-user@example.com");
        testUser = userRepository.save(testUser);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null,
                Collections.emptyList());

        testCards = new ArrayList<>();
        for (int i = 1; i <= 15; i++) {
            Card card = new Card();
            card.setName("RateLimitTest Card " + i);
            card.setType(CardType.NORMAL_MONSTER);
            card.setFrameType(FrameType.NORMAL);
            card.setDescription("A test card " + i);
            card.setRace(CardRace.DRAGON);
            card.setAttribute(CardAttribute.LIGHT);
            card.setAtk(1000);
            card.setDef(1000);
            card.setLevel(4);
            card = cardRepository.save(card);
            testCards.add(card);
        }

        testDeck = new Deck("RateLimitTest Deck", "A test deck", Format.TCG, testUser);
        DeckCard dc = new DeckCard(testDeck, testCards.get(0), DeckSection.MAIN, 3);
        testDeck.setDeckCards(new ArrayList<>(List.of(dc)));
        testDeck = deckRepository.save(testDeck);
    }

    private List<DeckCardRequestDto> createValidDeckCards() {
        List<DeckCardRequestDto> cardDtos = new ArrayList<>();
        for (int i = 0; i < 14; i++) {
            DeckCardRequestDto cardDto = new DeckCardRequestDto();
            cardDto.setCardId(testCards.get(i).getId());
            cardDto.setSection("MAIN");
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Test
    void testDeckValidationRateLimiting() throws Exception {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Validate Deck");
        deckDto.setFormatName("Goat");
        deckDto.setDescription("Validation Rate Limiting Test");
        deckDto.setDeckCards(createValidDeckCards());

        // Validate rate limit is 15 requests
        for (int i = 0; i < 15; i++) {
            mockMvc.perform(post("/api/decks/validate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(deckDto))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        // The 16th request must trigger 429
        mockMvc.perform(post("/api/decks/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void testDeckSaveRateLimiting() throws Exception {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Save Deck");
        deckDto.setFormatName("Goat");
        deckDto.setDescription("Save Rate Limiting Test");
        deckDto.setDeckCards(createValidDeckCards());

        // Save rate limit is 5 requests (we test both POST and PUT hitting the same
        // limiter key)
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/decks")
                    .with(authentication(testUserAuth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(deckDto))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());
        }

        // The 6th request must trigger 429 (either POST or PUT)
        mockMvc.perform(post("/api/decks")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void testDeckUpdateRateLimiting() throws Exception {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Updated Deck");
        deckDto.setFormatName("Goat");
        deckDto.setDescription("Update Rate Limiting Test");
        deckDto.setDeckCards(createValidDeckCards());

        for (int i = 0; i < 5; i++) {
            mockMvc.perform(put("/api/decks/" + testDeck.getId())
                    .with(authentication(testUserAuth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(deckDto))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        mockMvc.perform(put("/api/decks/" + testDeck.getId())
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }
}
