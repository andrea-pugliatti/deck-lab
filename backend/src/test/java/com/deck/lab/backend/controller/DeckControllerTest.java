package com.deck.lab.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.deck.lab.backend.config.RateLimitConfig;
import com.deck.lab.backend.config.properties.CorsProperties;
import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.security.SecurityConfig;
import com.deck.lab.backend.service.DeckService;
import com.deck.lab.backend.service.YdkService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(DeckController.class)
@Import({ SecurityConfig.class, CorsProperties.class, RateLimitConfig.class })
@DisplayName("DeckController WebMvc Slice Tests")
public class DeckControllerTest {

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
    private User unauthorizedUser;
    private UsernamePasswordAuthenticationToken testUserAuth;
    private UsernamePasswordAuthenticationToken unauthorizedUserAuth;
    private DeckResponseDto sampleDeckResponseDto;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) deckValidationRateLimiter).reset();
        ((InMemoryRateLimiter) deckSaveRateLimiter).reset();

        testUser = new User("controller-deck-user-1", "password", "ctrl-deck-user-1@example.com");
        testUser.setId(1L);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null,
                Collections.emptyList());

        unauthorizedUser = new User("controller-deck-user-2", "password",
                "ctrl-deck-user-2@example.com");
        unauthorizedUser.setId(2L);
        unauthorizedUserAuth = new UsernamePasswordAuthenticationToken(unauthorizedUser, null,
                Collections.emptyList());

        DeckCardResponseDto cardDto = new DeckCardResponseDto(1L, 1L, "Blue-Eyes White Dragon",
                CardType.NORMAL_MONSTER, "Legendary dragon", CardRace.DRAGON, CardAttribute.LIGHT,
                "Blue-Eyes", "/cards/images/1.jpg", DeckSection.MAIN, 3);

        sampleDeckResponseDto = new DeckResponseDto(100L, "ControllerTest Deck",
                "A test deck for controller",
                Format.TCG, List.of(cardDto), null, "controller-deck-user-1");
    }

    @Test
    @DisplayName("getAllDecks should return a paginated list of decks")
    void index_should_returnPagedDecks_when_queriedByUsername() throws Exception {
        given(deckService.findAllWithFilters(any(),
                any(),
                eq(testUser.getUsername()),
                eq(PageRequest.of(0, 20))))
                        .willReturn(new PageImpl<>(List.of(sampleDeckResponseDto),
                                PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/decks?username=" + testUser.getUsername())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("ControllerTest Deck")));
    }

    @Test
    @DisplayName("getDeckById should return deck details when authorized")
    void show_should_returnDeck_when_authorized() throws Exception {
        given(deckService.getDeckById(100L)).willReturn(sampleDeckResponseDto);

        mockMvc.perform(get("/api/decks/100")
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("ControllerTest Deck")))
                .andExpect(jsonPath("$.formatName", is("TCG")))
                .andExpect(jsonPath("$.deckCards", hasSize(1)))
                .andExpect(jsonPath("$.deckCards[0].cardId", is(1)));
    }

    @Test
    @DisplayName("getDeckById should return deck details publicly without authentication")
    void show_should_returnDeckPublicly_when_unauthenticated() throws Exception {
        given(deckService.getDeckById(100L)).willReturn(sampleDeckResponseDto);

        mockMvc.perform(get("/api/decks/100")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("ControllerTest Deck")))
                .andExpect(jsonPath("$.formatName", is("TCG")));
    }

    @Test
    @DisplayName("getDeckById should return 404 ProblemDetail when deck does not exist")
    void show_should_returnNotFound_when_deckDoesNotExist() throws Exception {
        given(deckService.getDeckById(999999L))
                .willThrow(new ResourceNotFoundException("Deck not found with id 999999"));

        mockMvc.perform(get("/api/decks/999999")
                .with(authentication(testUserAuth))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title", is("Resource Not Found")))
                .andExpect(jsonPath("$.detail", is("Deck not found with id 999999")));
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
    @DisplayName("createDeck should return 201 Created and saved DeckResponseDto")
    void create_should_returnCreatedDeck_when_payloadIsValid() throws Exception {
        DeckSaveRequestDto newDeckDto = new DeckSaveRequestDto();
        newDeckDto.setName("New Deck");
        newDeckDto.setFormatName(Format.GOAT);
        newDeckDto.setDescription("MockMvc test creation");
        newDeckDto.setDeckCards(createValidDeckCards());

        DeckResponseDto createdDto = new DeckResponseDto(101L, "New Deck", "MockMvc test creation",
                Format.GOAT, Collections.emptyList(), null, "controller-deck-user-1");

        given(deckService.createDeck(any(DeckSaveRequestDto.class), any(User.class)))
                .willReturn(createdDto);

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
    @DisplayName("createDeck should return 400 Bad Request when validation constraints fail")
    void create_should_returnBadRequest_when_deckNameIsBlank() throws Exception {
        DeckSaveRequestDto invalidDto = new DeckSaveRequestDto();
        invalidDto.setName(""); // Blank name is invalid
        invalidDto.setFormatName(Format.TCG);

        mockMvc.perform(post("/api/decks")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("validateDeck should return 200 OK when deck structure is valid")
    void validate_should_returnOk_when_deckStructureIsValid() throws Exception {
        DeckSaveRequestDto validDto = new DeckSaveRequestDto();
        validDto.setName("Valid Deck");
        validDto.setFormatName(Format.GOAT);
        validDto.setDescription("Validation success test");
        validDto.setDeckCards(createValidDeckCards());

        willDoNothing().given(deckService).validateDeck(any(DeckSaveRequestDto.class));

        mockMvc.perform(post("/api/decks/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("validateDeck should return 400 Bad Request when request body fails DTO validation")
    void validate_should_returnBadRequest_when_deckNameIsBlank() throws Exception {
        DeckSaveRequestDto invalidDto = new DeckSaveRequestDto();
        invalidDto.setName(""); // Blank name is invalid
        invalidDto.setFormatName(Format.TCG);

        mockMvc.perform(post("/api/decks/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("updateDeck should return 200 OK with updated DeckResponseDto when authorized")
    void update_should_returnUpdatedDeck_when_authorized() throws Exception {
        List<DeckCardRequestDto> cardDtos = new ArrayList<>();
        DeckCardRequestDto sideCard = new DeckCardRequestDto();
        sideCard.setCardId(1L);
        sideCard.setSection(DeckSection.SIDE);
        sideCard.setQuantity(1);
        cardDtos.add(sideCard);

        DeckSaveRequestDto updateDto = new DeckSaveRequestDto();
        updateDto.setName("ControllerTest Deck Updated");
        updateDto.setFormatName(Format.EDISON);
        updateDto.setDescription("Updated desc");
        updateDto.setDeckCards(cardDtos);

        DeckCardResponseDto updatedCardDto = new DeckCardResponseDto(1L, 1L,
                "Blue-Eyes White Dragon",
                CardType.NORMAL_MONSTER, "Legendary dragon", CardRace.DRAGON, CardAttribute.LIGHT,
                "Blue-Eyes", "/cards/images/1.jpg", DeckSection.SIDE, 1);

        DeckResponseDto updatedResponse = new DeckResponseDto(100L, "ControllerTest Deck Updated",
                "Updated desc", Format.EDISON, List.of(updatedCardDto), null,
                "controller-deck-user-1");

        given(deckService.updateDeck(eq(100L), any(DeckSaveRequestDto.class), any(User.class)))
                .willReturn(updatedResponse);

        mockMvc.perform(put("/api/decks/100")
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
    @DisplayName("updateDeck should return 404 when unauthorized user attempts to update deck")
    void update_should_returnNotFound_when_userIsUnauthorized() throws Exception {
        DeckSaveRequestDto updateDto = new DeckSaveRequestDto();
        updateDto.setName("Hacked Deck");
        updateDto.setFormatName(Format.TCG);
        updateDto.setDeckCards(createValidDeckCards());

        given(deckService.updateDeck(eq(100L), any(DeckSaveRequestDto.class), any(User.class)))
                .willThrow(new ResourceNotFoundException("Deck not found or unauthorized"));

        mockMvc.perform(put("/api/decks/100")
                .with(authentication(unauthorizedUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("deleteDeck should return 204 No Content when authorized user deletes deck")
    void delete_should_returnNoContent_when_authorized() throws Exception {
        willDoNothing().given(deckService).deleteDeck(eq(100L), any(User.class));

        mockMvc.perform(delete("/api/decks/100")
                .with(authentication(testUserAuth)))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("deleteDeck should return 404 when unauthorized user attempts to delete deck")
    void delete_should_returnNotFound_when_userIsUnauthorized() throws Exception {
        willThrow(new ResourceNotFoundException("Deck not found or unauthorized"))
                .given(deckService)
                .deleteDeck(eq(100L), any(User.class));

        mockMvc.perform(delete("/api/decks/100")
                .with(authentication(unauthorizedUserAuth)))
                .andExpect(status().isNotFound());
    }
}
