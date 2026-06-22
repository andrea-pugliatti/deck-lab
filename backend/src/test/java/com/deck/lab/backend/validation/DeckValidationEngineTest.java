package com.deck.lab.backend.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class DeckValidationEngineTest {

    private DeckValidationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new DeckValidationEngine();
    }

    private Deck createBaseDeck(int cardCount, int qtyPerCard) {
        Deck deck = new Deck();
        deck.setName("Test Deck");
        deck.setFormatName("Goat");

        List<DeckCard> cards = new ArrayList<>();
        for (long i = 1; i <= cardCount; i++) {
            Card card = new Card();
            card.setId(i);
            card.setName("Card " + i);
            card.setType("Normal Monster");
            cards.add(new DeckCard(deck, card, "MAIN", qtyPerCard));
        }
        deck.setDeckCards(cards);
        return deck;
    }

    @Test
    void validate_withValidDeck_hasNoErrors() {
        // 14 cards * 3 = 42 cards (valid size: 40-60)
        Deck deck = createBaseDeck(14, 3);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertTrue(errors.isEmpty(), () -> "Deck should be valid but has errors: " + errors);
    }

    @Test
    void validate_withEmptyDeck_isInvalid() {
        Deck deck = new Deck();
        deck.setDeckCards(Collections.emptyList());
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withTooFewCards_isInvalid() {
        // 13 cards * 3 = 39 cards
        Deck deck = createBaseDeck(13, 3);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withTooManyCards_isInvalid() {
        // 21 cards * 3 = 63 cards
        Deck deck = createBaseDeck(21, 3);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withExceededGeneralCopyLimit_isInvalid() {
        Deck deck = createBaseDeck(13, 3);
        Card card14 = new Card();
        card14.setId(14L);
        card14.setName("Card 14");
        card14.setType("Normal Monster");
        deck.getDeckCards().add(new DeckCard(deck, card14, "MAIN", 4)); // 4 copies of Card 14

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("exceeds the limit of 3 copies")));
    }

    @Test
    void validate_withExtraDeckMonsterInMainDeck_isInvalid() {
        Deck deck = createBaseDeck(13, 3);
        Card fusionCard = new Card();
        fusionCard.setId(14L);
        fusionCard.setName("Blue-Eyes Ultimate Dragon");
        fusionCard.setType("Fusion Monster");
        deck.getDeckCards().add(new DeckCard(deck, fusionCard, "MAIN", 1));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("must be placed in the EXTRA section")));
    }

    @Test
    void validate_withMainDeckCardInExtraDeck_isInvalid() {
        Deck deck = createBaseDeck(13, 3);
        Card normalCard = new Card();
        normalCard.setId(14L);
        normalCard.setName("Dark Magician");
        normalCard.setType("Normal Monster");
        deck.getDeckCards().add(new DeckCard(deck, normalCard, "EXTRA", 1));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("cannot be placed in the EXTRA section")));
    }

    @Test
    void validate_withForbiddenCard_isInvalid() {
        Deck deck = createBaseDeck(14, 3);
        Map<Long, CardStatus> limits = new HashMap<>();
        limits.put(1L, CardStatus.FORBIDDEN); // Card 1 is forbidden

        List<ValidationError> errors = engine.validate(deck, limits);
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("is forbidden in format 'Goat'")));
    }

    @Test
    void validate_withLimitedCardExceeded_isInvalid() {
        Deck deck = createBaseDeck(14, 3); // Card 1 has 3 copies
        Map<Long, CardStatus> limits = new HashMap<>();
        limits.put(1L, CardStatus.LIMITED); // Card 1 is limited

        List<ValidationError> errors = engine.validate(deck, limits);
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.message().contains("is limited in format 'Goat'")));
    }
}
