package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;

@SpringBootTest
@Transactional
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

    private List<DeckCardDto> createValidDeckCards() {
        List<DeckCardDto> cardDtos = new ArrayList<>();
        for (int i = 0; i < 14; i++) {
            DeckCardDto cardDto = new DeckCardDto();
            cardDto.setCardId(testCards.get(i).getId());
            cardDto.setSection("MAIN");
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        return cardDtos;
    }

    @Test
    void validateDeck_withValidDeck_doesNotThrow() {
        DeckDto requestDto = new DeckDto();
        requestDto.setName("Valid Validation Test Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(createValidDeckCards());

        assertDoesNotThrow(() -> {
            deckValidationService.validateDeck(requestDto);
        });
    }

    @Test
    void validateDeck_withInvalidDeck_throwsDeckValidationException() {
        DeckDto requestDto = new DeckDto();
        requestDto.setName("Too Small Validation Test Deck");
        requestDto.setFormatName("TCG");
        requestDto.setDeckCards(List.of()); // Empty deck

        assertThrows(DeckValidationException.class, () -> {
            deckValidationService.validateDeck(requestDto);
        });
    }

    @Test
    void validateAndGetCardMap_withValidDeck_returnsCorrectMap() {
        DeckDto requestDto = new DeckDto();
        requestDto.setName("Valid Map Test Deck");
        requestDto.setFormatName("Goat");
        requestDto.setDeckCards(createValidDeckCards());

        Map<Long, Card> cardMap = deckValidationService.validateAndGetCardMap(requestDto);
        assertNotNull(cardMap);
        assertEquals(14, cardMap.size());
        assertTrue(cardMap.containsKey(testCard.getId()));
    }
}
