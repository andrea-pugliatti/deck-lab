package com.deck.lab.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
@DisplayName("DeckService Integration Tests")
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
    @DisplayName("findAllWithFilters should return matching decks when filtered by creator")
    void findAllWithFilters_should_returnMatchingDecks_when_filteredByCreator() {
        Page<DeckResponseDto> result = deckService.findAllWithFilters(null,
                null,
                testUser.getUsername(),
                PageRequest.of(0, 10));
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("ServiceTest Deck");

        Page<DeckResponseDto> otherResult = deckService.findAllWithFilters(null,
                null,
                unauthorizedUser.getUsername(),
                PageRequest.of(0, 10));
        assertThat(otherResult).isEmpty();
    }

    @Test
    @DisplayName("getDeckById should return DeckResponseDto when deck exists")
    void getDeckById_should_returnDeckDto_when_deckExists() {
        DeckResponseDto result = deckService.getDeckById(testDeck.getId());
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(testDeck.getId());
        assertThat(result.getName()).isEqualTo("ServiceTest Deck");
        assertThat(result.getCards()).hasSize(1);
        assertThat(result.getCards().get(0).getCardId()).isEqualTo(testCard.getId());
    }

    @Test
    @DisplayName("getDeckById should throw ResourceNotFoundException when deck does not exist")
    void getDeckById_should_throwResourceNotFoundException_when_deckDoesNotExist() {
        assertThatThrownBy(() -> deckService.getDeckById(999999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("createDeck should persist new deck and return DeckResponseDto when payload is valid")
    void createDeck_should_saveDeckAndReturnDto_when_valid() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("New Created Deck");
        requestDto.setDescription("Freshly created");
        requestDto.setFormatName(Format.GOAT);
        requestDto.setDeckCards(createValidDeckCards());

        DeckResponseDto result = deckService.createDeck(requestDto, testUser);
        assertThat(result.getId()).isNotNull();
        assertThat(result.getName()).isEqualTo("New Created Deck");
        assertThat(result.getFormatName()).isEqualTo(Format.GOAT);
        assertThat(result.getCards()).hasSize(14);
        assertThat(result.getCards().get(0).getQuantity()).isEqualTo(3);

        Optional<Deck> savedDeck = deckRepository.findById(result.getId());
        assertThat(savedDeck).isPresent();
        assertThat(savedDeck.get().getUser().getId()).isEqualTo(testUser.getId());
    }

    @Test
    @DisplayName("createDeck should throw DeckValidationException when referenced card ID does not exist")
    void createDeck_should_throwDeckValidationException_when_cardNotFound() {
        List<DeckCardRequestDto> cardDtos = createValidDeckCards();
        cardDtos.get(0).setCardId(999999L); // Replace first card with non-existent ID

        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Invalid Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(cardDtos);

        assertThatThrownBy(() -> deckService.createDeck(requestDto, testUser))
                .isInstanceOf(DeckValidationException.class);
    }

    @Test
    @DisplayName("createDeck should throw DeckValidationException when deck size is below format minimum")
    void createDeck_should_throwDeckValidationException_when_deckSizeInvalid() {
        // Only 1 card (qty 3) = size 3, which is less than 40
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(testCard.getId());
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(3);

        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Size Invalid Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(List.of(cardDto));

        assertThatThrownBy(() -> deckService.createDeck(requestDto, testUser))
                .isInstanceOf(DeckValidationException.class);
    }

    @Test
    @DisplayName("updateDeck should update deck properties and cards when authorized")
    void updateDeck_should_updateDeckFieldsAndCards_when_authorized() {
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
        assertThat(result.getName()).isEqualTo("ServiceTest Deck Updated");
        assertThat(result.getDescription()).isEqualTo("An updated description");
        assertThat(result.getFormatName()).isEqualTo(Format.EDISON);
        assertThat(result.getCards()).hasSize(15);

        DeckCardResponseDto resFirst = result.getCards()
                .stream()
                .filter(c -> c.getCardId().equals(testCard.getId()))
                .findFirst()
                .orElseThrow();
        assertThat(resFirst.getQuantity()).isEqualTo(1);
        assertThat(resFirst.getSection()).isEqualTo(DeckSection.MAIN);

        DeckCardResponseDto resSecond = result.getCards()
                .stream()
                .filter(c -> c.getCardId().equals(testFusionCard.getId()))
                .findFirst()
                .orElseThrow();
        assertThat(resSecond.getQuantity()).isEqualTo(2);
        assertThat(resSecond.getSection()).isEqualTo(DeckSection.EXTRA);
    }

    @Test
    @DisplayName("updateDeck should handle existing card row IDs cleanly without optimistic lock conflicts")
    void updateDeck_should_notThrowLockingException_when_idsPopulated() {
        List<DeckCardRequestDto> validCards = createValidDeckCards();
        DeckSaveRequestDto updateRequest = new DeckSaveRequestDto();
        updateRequest.setName("ServiceTest Deck Initial");
        updateRequest.setDescription("Initial state");
        updateRequest.setFormatName(Format.TCG);
        updateRequest.setDeckCards(validCards);

        DeckResponseDto firstResult = deckService
                .updateDeck(testDeck.getId(), updateRequest, testUser);
        assertThat(firstResult.getCards().get(0).getId()).isNotNull();

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

        assertThatCode(() -> {
            deckService.updateDeck(testDeck.getId(), secondRequest, testUser);
        }).doesNotThrowAnyException();

        DeckResponseDto finalResult = deckService.getDeckById(testDeck.getId());
        assertThat(finalResult.getCards().get(0).getQuantity()).isEqualTo(2);
    }

    @Test
    @DisplayName("updateDeck should throw ResourceNotFoundException when non-owner attempts modification")
    void updateDeck_should_throwResourceNotFoundException_when_unauthorized() {
        DeckSaveRequestDto request = new DeckSaveRequestDto();
        request.setName("Hacked Deck");
        request.setFormatName(Format.TCG);

        assertThatThrownBy(() -> deckService.updateDeck(testDeck.getId(), request, unauthorizedUser))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("deleteDeck should delete deck when owner invokes delete")
    void deleteDeck_should_removeDeck_when_authorized() {
        Long deckId = testDeck.getId();
        assertThat(deckRepository.existsById(deckId)).isTrue();

        deckService.deleteDeck(deckId, testUser);

        assertThat(deckRepository.existsById(deckId)).isFalse();
    }

    @Test
    @DisplayName("deleteDeck should throw ResourceNotFoundException when non-owner invokes delete")
    void deleteDeck_should_throwResourceNotFoundException_when_unauthorized() {
        assertThatThrownBy(() -> deckService.deleteDeck(testDeck.getId(), unauthorizedUser))
                .isInstanceOf(ResourceNotFoundException.class);
        assertThat(deckRepository.existsById(testDeck.getId())).isTrue();
    }

    @Test
    @DisplayName("validateDeck should succeed without throwing exception when deck is valid")
    void validateDeck_should_notThrow_when_deckIsValid() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Valid Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(createValidDeckCards());

        assertThatCode(() -> {
            deckService.validateDeck(requestDto);
        }).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("validateDeck should throw DeckValidationException when deck violates rules")
    void validateDeck_should_throwDeckValidationException_when_deckIsInvalid() {
        // Less than 40 cards
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Too Small");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(List.of());

        assertThatThrownBy(() -> deckService.validateDeck(requestDto))
                .isInstanceOf(DeckValidationException.class);
    }
}
