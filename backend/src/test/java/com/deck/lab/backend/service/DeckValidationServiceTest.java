package com.deck.lab.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;

@SpringBootTest
@Transactional
@DisplayName("DeckValidationService Integration Tests")
class DeckValidationServiceTest {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckValidationService deckValidationService;

    private List<Card> testCards;
    private Card testCard;

    @BeforeEach
    void setUp() {
        testCards = new ArrayList<>();
        for (int i = 1; i <= 15; i++) {
            Card card = new Card();
            card.setName("ValidationTest Card " + i);
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
    @DisplayName("validate should succeed without throwing exceptions when deck conforms to format constraints")
    void validate_should_succeedWithoutException_when_deckIsValid() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Valid Validation Test Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(createValidDeckCards());

        assertThatCode(() -> {
            deckValidationService.validate(requestDto);
        }).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("validate should throw DeckValidationException when deck violates format constraints")
    void validate_should_throwDeckValidationException_when_deckIsInvalid() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Too Small Validation Test Deck");
        requestDto.setFormatName(Format.TCG);
        requestDto.setDeckCards(List.of()); // Empty deck

        assertThatThrownBy(() -> deckValidationService.validate(requestDto))
                .isInstanceOf(DeckValidationException.class);
    }

    @Test
    @DisplayName("validate should return map of resolved Card entities keyed by ID when deck is valid")
    void validate_should_returnCardMap_when_deckIsValid() {
        DeckSaveRequestDto requestDto = new DeckSaveRequestDto();
        requestDto.setName("Valid Map Test Deck");
        requestDto.setFormatName(Format.GOAT);
        requestDto.setDeckCards(createValidDeckCards());

        Map<Long, Card> cardMap = deckValidationService.validate(requestDto);
        assertThat(cardMap).isNotNull();
        assertThat(cardMap).hasSize(14);
        assertThat(cardMap).containsKey(testCard.getId());
    }
}
