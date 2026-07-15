package com.deck.lab.backend.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.service.GenerationService;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
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

    private UsernamePasswordAuthenticationToken testUserAuth;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) rateLimiter).reset();
        User testUser = new User("gen-test-user", "password", "gen-test-user@example.com");
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null,
                Collections.emptyList());
    }

    @Test
    void testAiGenerationRateLimiting() throws Exception {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto();
        request.setFormatName("TCG");
        request.setArchetype("Blue-Eyes");
        request.setStrategy("Aggro");
        request.setCustomPrompt("");

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
