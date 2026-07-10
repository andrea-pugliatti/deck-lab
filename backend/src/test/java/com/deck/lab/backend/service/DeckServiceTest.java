package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.exception.DeckValidationException;
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
    private List<Card> testCards;
    private Card testFusionCard;
    private Deck testDeck;

    @BeforeEach
    void setUp() {
        testUser = new User("service-deck-user-1", "password", "deck-user-1@example.com");
        testUser = userRepository.save(testUser);

        unauthorizedUser = new User("service-deck-user-2", "password", "deck-user-2@example.com");
        unauthorizedUser = userRepository.save(unauthorizedUser);

        testCards = new ArrayList<>();
        for (int i = 1; i <= 15; i++) {
            Card card = new Card();
            card.setName("ServiceTest Card " + i);
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
        testCard = testCards.get(0);

        testFusionCard = new Card();
        testFusionCard.setName("ServiceTest Fusion Monster");
        testFusionCard.setType(CardType.FUSION_MONSTER);
        testFusionCard.setFrameType(FrameType.FUSION);
        testFusionCard.setDescription("A test fusion monster.");
        testFusionCard.setRace(CardRace.WARRIOR);
        testFusionCard.setAttribute(CardAttribute.EARTH);
        testFusionCard.setAtk(2000);
        testFusionCard.setDef(2000);
        testFusionCard.setLevel(6);
        testFusionCard = cardRepository.save(testFusionCard);

        testDeck = new Deck("ServiceTest Deck", "A test deck", Format.TCG, testUser);
        DeckCard dc = new DeckCard(testDeck, testCard, DeckSection.MAIN, 3);
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
    void getDecksByUser_returnsMatchingDecks() {
        Page<DeckResponseDto> result = deckService.findAllWithFilters(null, null, testUser.getUsername(),
                PageRequest.of(0, 10));
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("ServiceTest Deck", result.getContent().get(0).getName());

        Page<DeckResponseDto> otherResult = deckService.findAllWithFilters(null, null, unauthorizedUser.getUsername(),
                PageRequest.of(0, 10));
        assertTrue(otherResult.isEmpty());
    }

    @Test
    void getDeckById_returnsDeckDto() {
        DeckResponseDto result = deckService.getDeckById(testDeck.getId());
        assertNotNull(result);
        assertEquals(testDeck.getId(), result.getId());
        assertEquals("ServiceTest Deck", result.getName());
        assertEquals(1, result.getCards().size());
        assertEquals(testCard.getId(), result.getCards().get(0).getCardId());
    }

    @Test
    void getDeckById_whenDeckDoesNotExist_throwsNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> {
            deckService.getDeckById(999999L);
        });
    }

    @Test
    void createDeck_savesDeckAndReturnsDto() {
        DeckResponseDto requestDto = new DeckResponseDto();
        requestDto.setName("New Created Deck");
        requestDto.setDescription("Freshly created");
        requestDto.setFormatName("Goat");
        requestDto.setDeckCards(createValidDeckCards());

        DeckResponseDto result = deckService.createDeck(requestDto, testUser);
        assertNotNull(result.getId());
        assertEquals("New Created Deck", result.getName());
        assertEquals("Goat", result.getFormatName());
        assertEquals(14, result.getCards().size());
        assertEquals(3, result.getCards().get(0).getQuantity());

        Optional<Deck> savedDeck = deckRepository.findById(result.getId());
        assertTrue(savedDeck.isPresent());
        assertEquals(testUser.getId(), savedDeck.get().getUser().getId());
    }

    @Test
    void createDeck_whenCardNotFound_throwsDeckValidationException() {
        List<DeckCardRequestDto> cardDtos = createValidDeckCards();
        cardDtos.get(0).setCardId(999999L); // Replace first card with non-existent ID

        DeckResponseDto requestDto = new DeckResponseDto();
        requestDto.setName("Invalid Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(cardDtos);

        assertThrows(DeckValidationException.class, () -> {
            deckService.createDeck(requestDto, testUser);
        });
    }

    @Test
    void createDeck_whenDeckSizeInvalid_throwsDeckValidationException() {
        // Only 1 card (qty 3) = size 3, which is less than 40
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(testCard.getId());
        cardDto.setSection("MAIN");
        cardDto.setQuantity(3);

        DeckResponseDto requestDto = new DeckResponseDto();
        requestDto.setName("Size Invalid Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(List.of(cardDto));

        assertThrows(DeckValidationException.class, () -> {
            deckService.createDeck(requestDto, testUser);
        });
    }

    @Test
    void updateDeck_whenAuthorized_updatesDeckFieldsAndCards() {
        List<DeckCardRequestDto> validCards = createValidDeckCards();
        // Modify the first card's quantity to 1 (still total = 42 - 2 = 40 cards, which
        // is valid)
        validCards.get(0).setQuantity(1);

        // Add a Fusion Monster in EXTRA section
        DeckCardRequestDto extraCardDto = new DeckCardRequestDto();
        extraCardDto.setCardId(testFusionCard.getId());
        extraCardDto.setSection("EXTRA");
        extraCardDto.setQuantity(2);

        List<DeckCardRequestDto> newCardsList = new ArrayList<>(validCards);
        newCardsList.add(extraCardDto);

        DeckResponseDto updateRequest = new DeckResponseDto();
        updateRequest.setName("ServiceTest Deck Updated");
        updateRequest.setDescription("An updated description");
        updateRequest.setFormatName("Edison");
        updateRequest.setDeckCards(newCardsList);

        DeckResponseDto result = deckService.updateDeck(testDeck.getId(), updateRequest, testUser);
        assertEquals("ServiceTest Deck Updated", result.getName());
        assertEquals("An updated description", result.getDescription());
        assertEquals("Edison", result.getFormatName());
        assertEquals(15, result.getCards().size());

        DeckCardResponseDto resFirst = result.getCards().stream()
                .filter(c -> c.getCardId().equals(testCard.getId()))
                .findFirst().orElseThrow();
        assertEquals(1, resFirst.getQuantity());
        assertEquals("MAIN", resFirst.getSection());

        DeckCardResponseDto resSecond = result.getCards().stream()
                .filter(c -> c.getCardId().equals(testFusionCard.getId())).findFirst().orElseThrow();
        assertEquals(2, resSecond.getQuantity());
        assertEquals("EXTRA", resSecond.getSection());
    }

    @Test
    void updateDeck_withPopulatedIds_doesNotThrowLockingException() {
        List<DeckCardRequestDto> validCards = createValidDeckCards();
        DeckResponseDto updateRequest = new DeckResponseDto();
        updateRequest.setName("ServiceTest Deck Initial");
        updateRequest.setDescription("Initial state");
        updateRequest.setFormatName("TCG");
        updateRequest.setDeckCards(validCards);

        DeckResponseDto firstResult = deckService.updateDeck(testDeck.getId(), updateRequest, testUser);
        assertNotNull(firstResult.getCards().get(0).getId());

        // Build a new request list from the response, adjusting quantity
        List<DeckCardRequestDto> updatedCards = firstResult.getCards().stream()
                .map(c -> {
                    DeckCardRequestDto req = new DeckCardRequestDto();
                    req.setId(c.getId());
                    req.setCardId(c.getCardId());
                    req.setSection(c.getSection());
                    req.setQuantity(c.getCardId().equals(validCards.get(0).getCardId()) ? 2 : c.getQuantity());
                    return req;
                })
                .toList();

        DeckResponseDto secondRequest = new DeckResponseDto();
        secondRequest.setName("ServiceTest Deck Initial");
        secondRequest.setDescription("Initial state");
        secondRequest.setFormatName("TCG");
        secondRequest.setDeckCards(updatedCards);

        assertDoesNotThrow(() -> {
            deckService.updateDeck(testDeck.getId(), secondRequest, testUser);
        });

        DeckResponseDto finalResult = deckService.getDeckById(testDeck.getId());
        assertEquals(2, finalResult.getCards().get(0).getQuantity());
    }

    @Test
    void updateDeck_whenUnauthorized_throwsNoSuchElementException() {
        DeckResponseDto request = new DeckResponseDto();
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

    @Test
    void validateDeck_withValidDeck_doesNotThrow() {
        DeckResponseDto requestDto = new DeckResponseDto();
        requestDto.setName("Valid Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(createValidDeckCards());

        assertDoesNotThrow(() -> {
            deckService.validateDeck(requestDto);
        });
    }

    @Test
    void validateDeck_withInvalidDeck_throwsDeckValidationException() {
        // Less than 40 cards
        DeckResponseDto requestDto = new DeckResponseDto();
        requestDto.setName("Too Small");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(List.of());

        assertThrows(DeckValidationException.class, () -> {
            deckService.validateDeck(requestDto);
        });
    }
}
