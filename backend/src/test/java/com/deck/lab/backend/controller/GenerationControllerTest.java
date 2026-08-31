package com.deck.lab.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.Strategy;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.security.SecurityConfig;
import com.deck.lab.backend.service.GenerationService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(GenerationController.class)
@Import({ SecurityConfig.class, CorsProperties.class, RateLimitConfig.class })
@DisplayName("GenerationController WebMvc Slice Tests")
public class GenerationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @Qualifier("aiGenerationRateLimiter")
    private RateLimiter rateLimiter;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GenerationService generationService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private UsernamePasswordAuthenticationToken testUserAuth;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) rateLimiter).reset();
        User testUser = new User("gen-test-user", "password", "gen-test-user@example.com");
        testUser.setId(1L);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null,
                Collections.emptyList());
    }

    @Test
    @DisplayName("generateDeck should return 200 OK and generated deck when authorized")
    void generateDeck_should_returnDeck_when_authorized() throws Exception {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto();
        request.setFormatName(Format.TCG);
        request.setArchetype("Blue-Eyes");
        request.setStrategy(Strategy.AGGRO);
        request.setCustomPrompt("");

        DeckGenerationResponseDto responseDto = new DeckGenerationResponseDto(
                "AI Generated Blue-Eyes", "Aggro strategy", Format.TCG, Collections.emptyList(),
                Collections.emptyList());
        given(generationService.generateDeck(any(DeckGenerateRequestDto.class)))
                .willReturn(responseDto);

        mockMvc.perform(post("/api/decks/ai/generate")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("suggestCards should return 200 OK and suggestions when authorized")
    void suggestCards_should_returnSuggestions_when_authorized() throws Exception {
        DeckSuggestRequestDto request = new DeckSuggestRequestDto();
        request.setFormatName(Format.TCG);
        request.setCurrentCards(Collections.emptyList());

        CardSuggestionResponseDto suggestion = new CardSuggestionResponseDto(
                "Ash Blossom", com.deck.lab.backend.model.DeckSection.MAIN,
                "Essential hand trap disruption",
                1L, CardType.EFFECT_MONSTER, "/cards/images/1.jpg");

        given(generationService.suggestCards(any(DeckSuggestRequestDto.class)))
                .willReturn(List.of(suggestion));

        mockMvc.perform(post("/api/decks/ai/suggest")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("generateDeck should enforce rate limit of 3 requests per window")
    void generateDeck_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto();
        request.setFormatName(Format.TCG);
        request.setArchetype("Blue-Eyes");
        request.setStrategy(Strategy.AGGRO);
        request.setCustomPrompt("");

        DeckGenerationResponseDto responseDto = new DeckGenerationResponseDto(
                "AI Generated Blue-Eyes", "Aggro strategy", Format.TCG, Collections.emptyList(),
                Collections.emptyList());
        given(generationService.generateDeck(any(DeckGenerateRequestDto.class)))
                .willReturn(responseDto);

        // The limit is configured to 3 attempts
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/decks/ai/generate")
                    .with(authentication(testUserAuth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        // The 4th attempt must be rate-limited (HTTP 429)
        mockMvc.perform(post("/api/decks/ai/generate")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }
}
