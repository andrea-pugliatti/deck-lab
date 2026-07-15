package com.deck.lab.backend.validation;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;

class DeckValidationEngineTest {

    private DeckValidationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new DeckValidationEngine();
    }

    private Deck createBaseDeck(int cardCount, int qtyPerCard, Format format) {
        Deck deck = new Deck();
        deck.setName("Test Deck");
        deck.setFormatName(format);

        List<DeckCard> cards = new ArrayList<>();
        for (long i = 1; i <= cardCount; i++) {
            Card card = new Card();
            card.setId(i);
            card.setName("Card " + i);
            card.setType(CardType.NORMAL_MONSTER);
            cards.add(new DeckCard(deck, card, DeckSection.MAIN, qtyPerCard));
        }
        deck.setDeckCards(cards);
        return deck;
    }

    @Test
    void validate_withValidDeck_hasNoErrors() {
        // TCG: 14 cards * 3 = 42 cards (valid size: 40-60)
        Deck deck = createBaseDeck(14, 3, Format.TCG);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertTrue(errors.isEmpty(), () -> "Deck should be valid but has errors: " + errors);
    }

    @Test
    void validate_withEmptyDeck_isInvalid() {
        Deck deck = new Deck();
        deck.setDeckCards(Collections.emptyList());
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withTooFewCards_isInvalid() {
        // TCG: 13 cards * 3 = 39 cards
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withTooManyCards_isInvalid() {
        // TCG: 21 cards * 3 = 63 cards
        Deck deck = createBaseDeck(21, 3, Format.TCG);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 60")));
    }

    @Test
    void validate_withGoatFormatDeck_limitsUpTo100() {
        // Goat: 21 cards * 3 = 63 cards (valid under Goat: 40-100)
        Deck deck = createBaseDeck(21, 3, Format.GOAT);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertTrue(errors.isEmpty(), () -> "Goat deck of 63 cards should be valid");

        // Goat: 34 cards * 3 = 102 cards (exceeds Goat max 100)
        Deck largeDeck = createBaseDeck(34, 3, Format.GOAT);
        List<ValidationError> largeErrors = engine.validate(largeDeck, Collections.emptyMap());
        assertFalse(largeErrors.isEmpty());
        assertTrue(largeErrors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 40 and 100")));
    }

    @Test
    void validate_withSpeedDuelFormatDeck_boundsChecked() {
        // Speed Duel: 8 cards * 3 = 24 cards (valid: 20-30)
        Deck deck = createBaseDeck(8, 3, Format.SPEED_DUEL);
        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertTrue(errors.isEmpty(), () -> "Speed Duel deck of 24 cards should be valid");

        // Speed Duel: 5 cards * 3 = 15 cards (too few, min 20)
        Deck smallDeck = createBaseDeck(5, 3, Format.SPEED_DUEL);
        List<ValidationError> smallErrors = engine.validate(smallDeck, Collections.emptyMap());
        assertFalse(smallErrors.isEmpty());
        assertTrue(smallErrors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 20 and 30")));

        // Speed Duel: 11 cards * 3 = 33 cards (too many, max 30)
        Deck largeDeck = createBaseDeck(11, 3, Format.SPEED_DUEL);
        List<ValidationError> largeErrors = engine.validate(largeDeck, Collections.emptyMap());
        assertFalse(largeErrors.isEmpty());
        assertTrue(largeErrors.stream()
                .anyMatch(e -> e.message().contains("Main Deck must contain between 20 and 30")));
    }

    @Test
    void validate_withExceededGeneralCopyLimit_isInvalid() {
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        Card card14 = new Card();
        card14.setId(14L);
        card14.setName("Card 14");
        card14.setType(CardType.NORMAL_MONSTER);
        deck.getDeckCards().add(new DeckCard(deck, card14, DeckSection.MAIN, 4)); // 4 copies of
                                                                                  // Card 14

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("exceeds the limit of 3 copies")));
    }

    @Test
    void validate_withExtraDeckMonsterInMainDeck_isInvalid() {
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        Card fusionCard = new Card();
        fusionCard.setId(14L);
        fusionCard.setName("Blue-Eyes Ultimate Dragon");
        fusionCard.setType(CardType.FUSION_MONSTER);
        deck.getDeckCards().add(new DeckCard(deck, fusionCard, DeckSection.MAIN, 1));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("must be placed in the EXTRA section")));
    }

    @Test
    void validate_withMainDeckCardInExtraDeck_isInvalid() {
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        Card normalCard = new Card();
        normalCard.setId(14L);
        normalCard.setName("Dark Magician");
        normalCard.setType(CardType.NORMAL_MONSTER);
        deck.getDeckCards().add(new DeckCard(deck, normalCard, DeckSection.EXTRA, 1));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("cannot be placed in the EXTRA section")));
    }

    @Test
    void validate_withForbiddenCard_isInvalid() {
        Deck deck = createBaseDeck(14, 3, Format.GOAT);
        Map<Long, CardStatus> limits = new HashMap<>();
        limits.put(1L, CardStatus.FORBIDDEN); // Card 1 is forbidden

        List<ValidationError> errors = engine.validate(deck, limits);
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream()
                .anyMatch(e -> e.message().contains("is forbidden in format 'Goat'")));
    }

    @Test
    void validate_withLimitedCardExceeded_isInvalid() {
        Deck deck = createBaseDeck(14, 3, Format.GOAT); // Card 1 has 3 copies
        Map<Long, CardStatus> limits = new HashMap<>();
        limits.put(1L, CardStatus.LIMITED); // Card 1 is limited

        List<ValidationError> errors = engine.validate(deck, limits);
        assertFalse(errors.isEmpty());
        assertTrue(
                errors.stream().anyMatch(e -> e.message().contains("is limited in format 'Goat'")));
    }
}
