package com.deck.lab.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;
import tools.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.Collections;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Card testCard;
    private User testUser;
    private UsernamePasswordAuthenticationToken testUserAuth;

    @BeforeEach
    void setUp() {
        testUser = new User("card-test-user", "password", "card-test-user@example.com");
        testUser = userRepository.save(testUser);
        testUserAuth = new UsernamePasswordAuthenticationToken(testUser, null, Collections.emptyList());

        testCard = new Card();
        testCard.setName("MyUniqueCard");
        testCard.setType("Normal Monster");
        testCard.setFrameType("normal");
        testCard.setDescription("This legendary dragon is a powerful engine of destruction.");
        testCard.setRace("Dragon");
        testCard.setAttribute("LIGHT");
        testCard.setArchetype("Blue-Eyes");
        testCard.setImageUrl("/cards/images/1.jpg");
        testCard.setImageUrlCropped("/cards/images/cropped/1.jpg");
        testCard.setAtk(3000);
        testCard.setDef(2500);
        testCard.setLevel(8);
        testCard = cardRepository.save(testCard);
    }

    @Test
    void testGetCards() throws Exception {
        mockMvc.perform(get("/api/cards")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testGetCardsWithFilter() throws Exception {
        mockMvc.perform(get("/api/cards")
                .param("q", "MyUniqueCard")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("MyUniqueCard")));
    }

    @Test
    void testGetCardsWithCaseInsensitiveFilter() throws Exception {
        mockMvc.perform(get("/api/cards")
                .param("q", "myuniquecard")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("MyUniqueCard")));
    }

    @Test
    void testGetCardsWithPagination() throws Exception {
        mockMvc.perform(get("/api/cards")
                .param("page", "0")
                .param("size", "1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size", is(1)))
                .andExpect(jsonPath("$.number", is(0)))
                .andExpect(jsonPath("$.content", hasSize(1)));
    }

    @Test
    void testGetCardById() throws Exception {
        mockMvc.perform(get("/api/cards/" + testCard.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("MyUniqueCard")))
                .andExpect(jsonPath("$.type", is("Normal Monster")));
    }

    @Test
    void testGetCardByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/cards/999999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateCard() throws Exception {
        Card newCard = new Card();
        newCard.setName("Dark Magician");
        newCard.setType("Normal Monster");
        newCard.setFrameType("normal");
        newCard.setDescription("The ultimate wizard.");
        newCard.setRace("Spellcaster");
        newCard.setAttribute("DARK");
        newCard.setAtk(2500);
        newCard.setDef(2100);
        newCard.setLevel(7);

        mockMvc.perform(post("/api/cards")
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCard))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Dark Magician")));
    }

    @Test
    void testUpdateCard() throws Exception {
        testCard.setName("MyUniqueCardUpdated");

        mockMvc.perform(put("/api/cards/" + testCard.getId())
                .with(authentication(testUserAuth))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testCard))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("MyUniqueCardUpdated")));
    }

    @Test
    void testDeleteCard() throws Exception {
        mockMvc.perform(delete("/api/cards/" + testCard.getId())
                .with(authentication(testUserAuth)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/cards/" + testCard.getId()))
                .andExpect(status().isNotFound());
    }
}
