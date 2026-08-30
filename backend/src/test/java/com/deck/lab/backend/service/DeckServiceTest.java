package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.exception.ResourceNotFoundException;
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
            cardDto.setSection(DeckSection.MAIN);
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Test
    void getDecksByUser_returnsMatchingDecks() {
        Page<DeckResponseDto> result = deckService.findAllWithFilters(null,
                null,
                testUser.getUsername(),
                PageRequest.of(0, 10));
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("ServiceTest Deck", result.getContent().get(0).getName());

        Page<DeckResponseDto> otherResult = deckService.findAllWithFilters(null,
                null,
                unauthorizedUser.getUsername(),
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
    void getDeckById_whenDeckDoesNotExist_throwsResourceNotFoundException() {
        assertThrows(ResourceNotFoundException.class, () -> {
            deckService.getDeckById(999999L);
        });
    }

    @Test
    void createDeck_savesDeckAndReturnsDto() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("New Created Deck");
        requestDto.setDescription("Freshly created");
        requestDto.setFormatName(Format.GOAT);
        requestDto.setDeckCards(createValidDeckCards());

        DeckResponseDto result = deckService.createDeck(requestDto, testUser);
        assertNotNull(result.getId());
        assertEquals("New Created Deck", result.getName());
        assertEquals(Format.GOAT, result.getFormatName());
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

        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Invalid Deck");
        requestDto.setFormatName(Format.TCG);
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
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(3);

        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Size Invalid Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(List.of(cardDto));

        assertThrows(DeckValidationException.class, () -> {
            deckService.createDeck(requestDto, testUser);
        });
    }

    @Test
    void updateDeck_whenAuthorized_updatesDeckFieldsAndCards() {
        List<DeckCardRequestDto> validCards = createValidDeckCards();
        validCards.get(0).setQuantity(1);

        // Add a Fusion Monster in EXTRA section
        DeckCardRequestDto extraCardDto = new DeckCardRequestDto();
        extraCardDto.setCardId(testFusionCard.getId());
        extraCardDto.setSection(DeckSection.EXTRA);
        extraCardDto.setQuantity(2);

        List<DeckCardRequestDto> newCardsList = new ArrayList<>(validCards);
        newCardsList.add(extraCardDto);

        DeckSaveRequestDto updateRequest = new DeckSaveRequestDto();
        updateRequest.setName("ServiceTest Deck Updated");
        updateRequest.setDescription("An updated description");
        updateRequest.setFormatName(Format.EDISON);
        updateRequest.setDeckCards(newCardsList);

        DeckResponseDto result = deckService.updateDeck(testDeck.getId(), updateRequest, testUser);
        assertEquals("ServiceTest Deck Updated", result.getName());
        assertEquals("An updated description", result.getDescription());
        assertEquals(Format.EDISON, result.getFormatName());
        assertEquals(15, result.getCards().size());

        DeckCardResponseDto resFirst = result.getCards()
                .stream()
                .filter(c -> c.getCardId().equals(testCard.getId()))
                .findFirst()
                .orElseThrow();
        assertEquals(1, resFirst.getQuantity());
        assertEquals(DeckSection.MAIN, resFirst.getSection());

        DeckCardResponseDto resSecond = result.getCards()
                .stream()
                .filter(c -> c.getCardId().equals(testFusionCard.getId()))
                .findFirst()
                .orElseThrow();
        assertEquals(2, resSecond.getQuantity());
        assertEquals(DeckSection.EXTRA, resSecond.getSection());
    }

    @Test
    void updateDeck_withPopulatedIds_doesNotThrowLockingException() {
        List<DeckCardRequestDto> validCards = createValidDeckCards();
        DeckSaveRequestDto updateRequest = new DeckSaveRequestDto();
        updateRequest.setName("ServiceTest Deck Initial");
        updateRequest.setDescription("Initial state");
        updateRequest.setFormatName(Format.TCG);
        updateRequest.setDeckCards(validCards);

        DeckResponseDto firstResult = deckService
                .updateDeck(testDeck.getId(), updateRequest, testUser);
        assertNotNull(firstResult.getCards().get(0).getId());

        // Build a new request list from the response, adjusting quantity
        List<DeckCardRequestDto> updatedCards = firstResult.getCards()
                .stream()
                .map(c -> {
                    DeckCardRequestDto req = new DeckCardRequestDto();
                    req.setId(c.getId());
                    req.setCardId(c.getCardId());
                    req.setSection(c.getSection());
                    req.setQuantity(c.getCardId().equals(validCards.get(0).getCardId())
                            ? 2
                            : c.getQuantity());
                    return req;
                })
                .toList();

        DeckSaveRequestDto secondRequest = new DeckSaveRequestDto();
        secondRequest.setName("ServiceTest Deck Initial");
        secondRequest.setDescription("Initial state");
        secondRequest.setFormatName(Format.TCG);
        secondRequest.setDeckCards(updatedCards);

        assertDoesNotThrow(() -> {
            deckService.updateDeck(testDeck.getId(), secondRequest, testUser);
        });

        DeckResponseDto finalResult = deckService.getDeckById(testDeck.getId());
        assertEquals(2, finalResult.getCards().get(0).getQuantity());
    }

    @Test
    void updateDeck_whenUnauthorized_throwsResourceNotFoundException() {
        DeckSaveRequestDto request = new DeckSaveRequestDto();
        request.setName("Hacked Deck");
        request.setFormatName(Format.TCG);

        assertThrows(ResourceNotFoundException.class, () -> {
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
    void deleteDeck_whenUnauthorized_throwsResourceNotFoundException() {
        assertThrows(ResourceNotFoundException.class, () -> {
            deckService.deleteDeck(testDeck.getId(), unauthorizedUser);
        });
        assertTrue(deckRepository.existsById(testDeck.getId()));
    }

    @Test
    void validateDeck_withValidDeck_doesNotThrow() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Valid Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(createValidDeckCards());

        assertDoesNotThrow(() -> {
            deckService.validateDeck(requestDto);
        });
    }

    @Test
    void validateDeck_withInvalidDeck_throwsDeckValidationException() {
        // Less than 40 cards
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Too Small");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(List.of());

        assertThrows(DeckValidationException.class, () -> {
            deckService.validateDeck(requestDto);
        });
    }
}
