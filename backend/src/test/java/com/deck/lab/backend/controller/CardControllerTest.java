package com.deck.lab.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.deck.lab.backend.config.properties.CorsProperties;
import com.deck.lab.backend.dto.request.CardSaveRequestDto;
import com.deck.lab.backend.dto.response.CardResponseDto;
import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.mapper.CardMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.SecurityConfig;
import com.deck.lab.backend.service.CardService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(CardController.class)
@Import({ SecurityConfig.class, CorsProperties.class })
@DisplayName("CardController WebMvc Slice Tests")
public class CardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CardService cardService;

    @MockitoBean
    private CardMapper cardMapper;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private Card testCard;
    private CardResponseDto testCardResponseDto;
    private User testUser;
    private UsernamePasswordAuthenticationToken testUserAuth;

    @BeforeEach
    void setUp() {
        testUser = new User("card-test-user", "password", "card-test-user@example.com");
        testUser.setId(1L);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null,
                Collections.emptyList());

        testCard = new Card();
        testCard.setId(1L);
        testCard.setName("MyUniqueCard");
        testCard.setType(CardType.NORMAL_MONSTER);
        testCard.setFrameType(FrameType.NORMAL);
        testCard.setDescription("This legendary dragon is a powerful engine of destruction.");
        testCard.setRace(CardRace.DRAGON);
        testCard.setAttribute(CardAttribute.LIGHT);
        testCard.setArchetype("Blue-Eyes");
        testCard.setImageUrl("/cards/images/1.jpg");
        testCard.setImageUrlCropped("/cards/images/cropped/1.jpg");
        testCard.setAtk(3000);
        testCard.setDef(2500);
        testCard.setLevel(8);

        testCardResponseDto = new CardResponseDto(1L, "MyUniqueCard", CardType.NORMAL_MONSTER,
                "This legendary dragon is a powerful engine of destruction.", CardRace.DRAGON,
                CardAttribute.LIGHT, "Blue-Eyes", "/cards/images/1.jpg",
                "/cards/images/cropped/1.jpg",
                FrameType.NORMAL, 3000, 2500, 8, null, null);
    }

    @Test
    @DisplayName("index should return a paginated list of cards")
    void index_should_returnPagedCards_when_calledWithoutFilters() throws Exception {
        given(cardService
                .findAllOrWithFilters(any(), any(), any(), any(), any(), eq(PageRequest.of(0, 20))))
                        .willReturn(new PageImpl<>(List.of(testCard), PageRequest.of(0, 20), 1));
        given(cardMapper.toDto(testCard)).willReturn(testCardResponseDto);

        mockMvc.perform(get("/api/cards")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("MyUniqueCard")));
    }

    @Test
    @DisplayName("index should filter cards by name query parameter")
    void index_should_filterCardsByName_when_queryProvided() throws Exception {
        given(cardService.findAllOrWithFilters(eq(
                "MyUniqueCard"), any(), any(), any(), any(), eq(PageRequest.of(0, 20))))
                        .willReturn(new PageImpl<>(List.of(testCard), PageRequest.of(0, 20), 1));
        given(cardMapper.toDto(testCard)).willReturn(testCardResponseDto);

        mockMvc.perform(get("/api/cards")
                .param("q", "MyUniqueCard")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("MyUniqueCard")));
    }

    @Test
    @DisplayName("index should support pagination parameters")
    void index_should_paginateResults_when_pageAndSizeSpecified() throws Exception {
        given(cardService
                .findAllOrWithFilters(any(), any(), any(), any(), any(), eq(PageRequest.of(0, 1))))
                        .willReturn(new PageImpl<>(List.of(testCard), PageRequest.of(0, 1), 1));
        given(cardMapper.toDto(testCard)).willReturn(testCardResponseDto);

        mockMvc.perform(get("/api/cards")
                .param("page", "0")
                .param("size", "1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.size", is(1)))
                .andExpect(jsonPath("$.page.number", is(0)))
                .andExpect(jsonPath("$.content", hasSize(1)));
    }

    @Test
    @DisplayName("show should return card details when card exists")
    void show_should_returnCardDto_when_cardExists() throws Exception {
        given(cardService.getById(1L)).willReturn(testCard);
        given(cardMapper.toDto(testCard)).willReturn(testCardResponseDto);

        mockMvc.perform(get("/api/cards/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("MyUniqueCard")))
                .andExpect(jsonPath("$.type", is("Normal Monster")));
    }

    @Test
    @DisplayName("show should return 404 ProblemDetail when card does not exist")
    void show_should_returnNotFound_when_cardDoesNotExist() throws Exception {
        given(cardService.getById(999999L))
                .willThrow(new ResourceNotFoundException("Card not found"));

        mockMvc.perform(get("/api/cards/999999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("createCard should return 201 Created and CardResponseDto when payload is valid")
    void create_should_returnCreatedCard_when_authorized() throws Exception {
        CardSaveRequestDto requestDto = new CardSaveRequestDto();
        requestDto.setName("Dark Magician");
        requestDto.setType(CardType.NORMAL_MONSTER);
        requestDto.setFrameType(FrameType.NORMAL);
        requestDto.setDescription("The ultimate wizard.");
        requestDto.setRace(CardRace.SPELLCASTER);
        requestDto.setAttribute(CardAttribute.DARK);
        requestDto.setAtk(2500);
        requestDto.setDef(2100);
        requestDto.setLevel(7);

        Card createdCard = new Card();
        createdCard.setId(2L);
        createdCard.setName("Dark Magician");

        CardResponseDto createdResponse = new CardResponseDto(2L, "Dark Magician",
                CardType.NORMAL_MONSTER,
                "The ultimate wizard.", CardRace.SPELLCASTER, CardAttribute.DARK, null, null, null,
                FrameType.NORMAL, 2500, 2100, 7, null, null);

        given(cardMapper.toEntity(any(CardSaveRequestDto.class))).willReturn(createdCard);
        given(cardService.save(any(Card.class))).willReturn(createdCard);
        given(cardMapper.toDto(createdCard)).willReturn(createdResponse);

        mockMvc.perform(post("/api/cards")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Dark Magician")));
    }

    @Test
    @DisplayName("createCard should return 400 Bad Request when request body fails validation")
    void create_should_returnBadRequest_when_payloadIsInvalid() throws Exception {
        CardSaveRequestDto invalidRequest = new CardSaveRequestDto();
        invalidRequest.setName(""); // Blank name is invalid
        invalidRequest.setType(null); // Missing type is invalid

        mockMvc.perform(post("/api/cards")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("updateCard should return 200 OK and updated CardResponseDto when payload is valid")
    void update_should_returnUpdatedCard_when_authorized() throws Exception {
        CardSaveRequestDto updateRequest = new CardSaveRequestDto();
        updateRequest.setName("MyUniqueCardUpdated");
        updateRequest.setType(testCard.getType());
        updateRequest.setFrameType(testCard.getFrameType());
        updateRequest.setDescription(testCard.getDescription());
        updateRequest.setRace(testCard.getRace());
        updateRequest.setAttribute(testCard.getAttribute());
        updateRequest.setAtk(testCard.getAtk());
        updateRequest.setDef(testCard.getDef());
        updateRequest.setLevel(testCard.getLevel());

        Card updatedCard = new Card();
        updatedCard.setId(1L);
        updatedCard.setName("MyUniqueCardUpdated");

        CardResponseDto updatedResponse = new CardResponseDto(1L, "MyUniqueCardUpdated",
                CardType.NORMAL_MONSTER,
                testCard.getDescription(), testCard.getRace(), testCard.getAttribute(), "Blue-Eyes",
                "/cards/images/1.jpg", "/cards/images/cropped/1.jpg", FrameType.NORMAL, 3000, 2500,
                8, null, null);

        given(cardService.getById(1L)).willReturn(testCard);
        given(cardService.edit(any(Card.class))).willReturn(updatedCard);
        given(cardMapper.toDto(any(Card.class))).willReturn(updatedResponse);

        mockMvc.perform(put("/api/cards/1")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("MyUniqueCardUpdated")));
    }

    @Test
    @DisplayName("updateCard should return 400 Bad Request when request body fails validation")
    void update_should_returnBadRequest_when_payloadIsInvalid() throws Exception {
        CardSaveRequestDto invalidRequest = new CardSaveRequestDto();
        invalidRequest.setName("  "); // Blank name
        invalidRequest.setType(null); // Null type

        mockMvc.perform(put("/api/cards/1")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("deleteCard should return 204 No Content when card exists and user is authorized")
    void delete_should_returnNoContent_when_authorized() throws Exception {
        willDoNothing().given(cardService).deleteById(1L);

        mockMvc.perform(delete("/api/cards/1")
                .with(authentication(testUserAuth)))
                .andExpect(status().isNoContent());
    }
}
