package com.deck.lab.backend.service;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CardServiceTest {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CardService cardService;

    private Card testCard;

    @BeforeEach
    void setUp() {
        testCard = new Card();
        testCard.setName("ServiceTest Blue-Eyes");
        testCard.setType("Normal Monster");
        testCard.setFrameType("normal");
        testCard.setDescription("Legendary dragon.");
        testCard.setRace("Dragon");
        testCard.setAttribute("LIGHT");
        testCard.setArchetype("Blue-Eyes");
        testCard.setImageUrl("/cards/images/service1.jpg");
        testCard.setImageUrlCropped("/cards/images/cropped/service1.jpg");
        testCard.setAtk(3000);
        testCard.setDef(2500);
        testCard.setLevel(8);
        testCard = cardRepository.save(testCard);
    }

    @Test
    void findAllOrWithFilters_returnsMatchingCards() {
        Page<Card> result = cardService.findAllOrWithFilters("ServiceTest Blue-Eyes", null, null, null, null,
                PageRequest.of(0, 10));
        assertNotNull(result);
        assertTrue(result.getTotalElements() >= 1);
        assertTrue(result.getContent().stream().anyMatch(c -> c.getName().equals(testCard.getName())));
    }

    @Test
    void findById_whenCardExists_returnsOptionalOfCard() {
        Optional<Card> result = cardService.findById(testCard.getId());
        assertTrue(result.isPresent());
        assertEquals(testCard.getId(), result.get().getId());
    }

    @Test
    void findById_whenCardDoesNotExist_returnsEmptyOptional() {
        Optional<Card> result = cardService.findById(999999L);
        assertFalse(result.isPresent());
    }

    @Test
    void existsById_returnsCorrectBoolean() {
        assertTrue(cardService.existsById(testCard.getId()));
        assertFalse(cardService.existsById(999999L));
    }

    @Test
    void getById_whenCardExists_returnsCard() {
        Card result = cardService.getById(testCard.getId());
        assertNotNull(result);
        assertEquals(testCard.getId(), result.getId());
    }

    @Test
    void getById_whenCardDoesNotExist_throwsResourceNotFoundException() {
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            cardService.getById(999999L);
        });
        assertEquals("Card not found with id: 999999", exception.getMessage());
    }

    @Test
    void save_savesCardSuccessfully() {
        Card newCard = new Card();
        newCard.setName("ServiceTest Dark Magician");
        newCard.setType("Normal Monster");
        newCard.setFrameType("normal");
        newCard.setDescription("Ultimate wizard.");
        newCard.setRace("Spellcaster");
        newCard.setAttribute("DARK");
        newCard.setAtk(2500);
        newCard.setDef(2100);
        newCard.setLevel(7);

        Card saved = cardService.save(newCard);
        assertNotNull(saved.getId());
        assertEquals("ServiceTest Dark Magician", saved.getName());

        Optional<Card> fetched = cardRepository.findById(saved.getId());
        assertTrue(fetched.isPresent());
    }

    @Test
    void edit_updatesCardSuccessfully() {
        testCard.setName("ServiceTest Blue-Eyes Updated");
        Card updated = cardService.edit(testCard);
        assertEquals("ServiceTest Blue-Eyes Updated", updated.getName());

        Card fetched = cardRepository.findById(testCard.getId()).orElseThrow();
        assertEquals("ServiceTest Blue-Eyes Updated", fetched.getName());
    }

    @Test
    void deleteById_whenCardExists_deletesCard() {
        Long id = testCard.getId();
        assertTrue(cardRepository.existsById(id));

        cardService.deleteById(id);

        assertFalse(cardRepository.existsById(id));
    }

    @Test
    void deleteById_whenCardDoesNotExist_doesNotThrow() {
        assertDoesNotThrow(() -> cardService.deleteById(999999L));
    }
}
