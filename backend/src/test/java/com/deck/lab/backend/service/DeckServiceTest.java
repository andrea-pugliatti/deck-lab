package com.deck.lab.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DeckServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private DeckService deckService;

    private User testUser;
    private User unauthorizedUser;
    private Card testCard;
    private Deck testDeck;

    @BeforeEach
    void setUp() {
        testUser = new User("service-deck-user-1", "password", "deck-user-1@example.com");
        testUser = userRepository.save(testUser);

        unauthorizedUser = new User("service-deck-user-2", "password", "deck-user-2@example.com");
        unauthorizedUser = userRepository.save(unauthorizedUser);

        testCard = new Card();
        testCard.setName("ServiceTest Card");
        testCard.setType("Normal Monster");
        testCard.setFrameType("normal");
        testCard.setDescription("A test card.");
        testCard.setRace("Dragon");
        testCard.setAttribute("LIGHT");
        testCard.setAtk(1000);
        testCard.setDef(1000);
        testCard.setLevel(4);
        testCard = cardRepository.save(testCard);

        testDeck = new Deck("ServiceTest Deck", "A test deck", "TCG", testUser);
        DeckCard dc = new DeckCard(testDeck, testCard, "MAIN", 3);
        testDeck.setDeckCards(new ArrayList<>(List.of(dc)));
        testDeck = deckRepository.save(testDeck);
    }

    @Test
    void getDecksByUser_returnsMatchingDecks() {
        List<DeckDto> result = deckService.getDecksByUser(testUser);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ServiceTest Deck", result.get(0).getName());

        List<DeckDto> otherResult = deckService.getDecksByUser(unauthorizedUser);
        assertTrue(otherResult.isEmpty());
    }

    @Test
    void getDeckById_whenAuthorized_returnsDeckDto() {
        DeckDto result = deckService.getDeckById(testDeck.getId(), testUser);
        assertNotNull(result);
        assertEquals(testDeck.getId(), result.getId());
        assertEquals("ServiceTest Deck", result.getName());
        assertEquals(1, result.getDeckCards().size());
        assertEquals(testCard.getId(), result.getDeckCards().get(0).getCardId());
    }

    @Test
    void getDeckById_whenUnauthorized_throwsNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> {
            deckService.getDeckById(testDeck.getId(), unauthorizedUser);
        });
    }

    @Test
    void getDeckById_whenDeckDoesNotExist_throwsNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> {
            deckService.getDeckById(999999L, testUser);
        });
    }

    @Test
    void createDeck_savesDeckAndReturnsDto() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(testCard.getId());
        cardDto.setSection("MAIN");
        cardDto.setQuantity(2);

        DeckDto requestDto = new DeckDto();
        requestDto.setName("New Created Deck");
        requestDto.setDescription("Freshly created");
        requestDto.setFormatName("Goat");
        requestDto.setDeckCards(List.of(cardDto));

        DeckDto result = deckService.createDeck(requestDto, testUser);
        assertNotNull(result.getId());
        assertEquals("New Created Deck", result.getName());
        assertEquals("Goat", result.getFormatName());
        assertEquals(1, result.getDeckCards().size());
        assertEquals(2, result.getDeckCards().get(0).getQuantity());

        Optional<Deck> savedDeck = deckRepository.findById(result.getId());
        assertTrue(savedDeck.isPresent());
        assertEquals(testUser.getId(), savedDeck.get().getUser().getId());
    }

    @Test
    void createDeck_whenCardNotFound_throwsIllegalArgumentException() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(999999L); // Non-existent card ID
        cardDto.setSection("MAIN");
        cardDto.setQuantity(2);

        DeckDto requestDto = new DeckDto();
        requestDto.setName("Invalid Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(List.of(cardDto));

        assertThrows(IllegalArgumentException.class, () -> {
            deckService.createDeck(requestDto, testUser);
        });
    }

    @Test
    void updateDeck_whenAuthorized_updatesDeckFieldsAndCards() {
        // Create another card to add to the deck
        Card secondCard = new Card();
        secondCard.setName("Second Card");
        secondCard.setType("Spell Card");
        secondCard.setFrameType("spell");
        secondCard.setDescription("A spell card.");
        secondCard.setRace("Normal");
        final Card savedSecondCard = cardRepository.save(secondCard);

        DeckCardDto firstCardDto = new DeckCardDto();
        firstCardDto.setCardId(testCard.getId());
        firstCardDto.setSection("MAIN");
        firstCardDto.setQuantity(1); // Quantity updated from 3 to 1

        DeckCardDto secondCardDto = new DeckCardDto();
        secondCardDto.setCardId(savedSecondCard.getId());
        secondCardDto.setSection("EXTRA");
        secondCardDto.setQuantity(2);

        DeckDto updateRequest = new DeckDto();
        updateRequest.setName("ServiceTest Deck Updated");
        updateRequest.setDescription("An updated description");
        updateRequest.setFormatName("Edison");
        updateRequest.setDeckCards(List.of(firstCardDto, secondCardDto));

        DeckDto result = deckService.updateDeck(testDeck.getId(), updateRequest, testUser);
        assertEquals("ServiceTest Deck Updated", result.getName());
        assertEquals("An updated description", result.getDescription());
        assertEquals("Edison", result.getFormatName());
        assertEquals(2, result.getDeckCards().size());

        DeckCardDto resFirst = result.getDeckCards().stream().filter(c -> c.getCardId().equals(testCard.getId()))
                .findFirst().orElseThrow();
        assertEquals(1, resFirst.getQuantity());
        assertEquals("MAIN", resFirst.getSection());

        DeckCardDto resSecond = result.getDeckCards().stream()
                .filter(c -> c.getCardId().equals(savedSecondCard.getId())).findFirst().orElseThrow();
        assertEquals(2, resSecond.getQuantity());
        assertEquals("EXTRA", resSecond.getSection());
    }

    @Test
    void updateDeck_whenUnauthorized_throwsNoSuchElementException() {
        DeckDto request = new DeckDto();
        request.setName("Hacked Deck");
        request.setFormatName("TCG");

        assertThrows(NoSuchElementException.class, () -> {
            deckService.updateDeck(testDeck.getId(), request, unauthorizedUser);
        });
    }

    @Test
    void deleteDeck_whenAuthorized_deletesDeck() {
        Long deckId = testDeck.getId();
        assertTrue(deckRepository.existsById(deckId));

        deckService.deleteDeck(deckId, testUser);

        assertFalse(deckRepository.existsById(deckId));
    }

    @Test
    void deleteDeck_whenUnauthorized_throwsNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> {
            deckService.deleteDeck(testDeck.getId(), unauthorizedUser);
        });
        assertTrue(deckRepository.existsById(testDeck.getId()));
    }
}
