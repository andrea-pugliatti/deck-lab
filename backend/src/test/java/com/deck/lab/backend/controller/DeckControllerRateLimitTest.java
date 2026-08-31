package com.deck.lab.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.deck.lab.backend.config.RateLimitConfig;
import com.deck.lab.backend.config.properties.CorsProperties;
import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.security.SecurityConfig;
import com.deck.lab.backend.service.DeckService;
import com.deck.lab.backend.service.YdkService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(DeckController.class)
@Import({SecurityConfig.class, CorsProperties.class, RateLimitConfig.class})
@DisplayName("DeckController Rate Limiting WebMvc Slice Tests")
public class DeckControllerRateLimitTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    @Qualifier("deckValidationRateLimiter")
    private RateLimiter deckValidationRateLimiter;

    @Autowired
    @Qualifier("deckSaveRateLimiter")
    private RateLimiter deckSaveRateLimiter;

    @MockitoBean
    private DeckService deckService;

    @MockitoBean
    private YdkService ydkService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private User testUser;
    private UsernamePasswordAuthenticationToken testUserAuth;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) deckValidationRateLimiter).reset();
        ((InMemoryRateLimiter) deckSaveRateLimiter).reset();

        testUser = new User("ctrl-rate-user", "password", "ctrl-rate-user@example.com");
        testUser.setId(1L);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList());

        DeckResponseDto mockResponse = new DeckResponseDto(100L, "Sample Deck", "Desc", Format.GOAT,
                Collections.emptyList(), null, "ctrl-rate-user");
        given(deckService.createDeck(any(), any())).willReturn(mockResponse);
        given(deckService.updateDeck(any(), any(), any())).willReturn(mockResponse);
        willDoNothing().given(deckService).validateDeck(any());
    }

    private List<DeckCardRequestDto> createValidDeckCards() {
        List<DeckCardRequestDto> cardDtos = new ArrayList<>();
        for (long i = 1; i <= 14; i++) {
            DeckCardRequestDto cardDto = new DeckCardRequestDto();
            cardDto.setCardId(i);
            cardDto.setSection(DeckSection.MAIN);
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Test
    @DisplayName("validateDeck should enforce rate limit of 15 requests per window")
    void validateDeck_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Validate Deck");
        deckDto.setFormatName(Format.GOAT);
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
    @DisplayName("createDeck should enforce rate limit of 5 requests per window")
    void createDeck_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Save Deck");
        deckDto.setFormatName(Format.GOAT);
        deckDto.setDescription("Save Rate Limiting Test");
        deckDto.setDeckCards(createValidDeckCards());

        // Save rate limit is 5 requests
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/decks")
                    .with(authentication(testUserAuth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(deckDto))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isCreated());
        }

        // The 6th request must trigger 429
        mockMvc.perform(post("/api/decks")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("updateDeck should enforce rate limit of 5 requests per window")
    void updateDeck_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Updated Deck");
        deckDto.setFormatName(Format.GOAT);
        deckDto.setDescription("Update Rate Limiting Test");
        deckDto.setDeckCards(createValidDeckCards());

        for (int i = 0; i < 5; i++) {
            mockMvc.perform(put("/api/decks/100")
                    .with(authentication(testUserAuth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(deckDto))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        mockMvc.perform(put("/api/decks/100")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deckDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }
}
