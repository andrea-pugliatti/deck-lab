package com.deck.lab.backend.validation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.EnumSource;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;

@DisplayName("DeckValidationEngine Unit Tests")
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

    @ParameterizedTest(name = "Format {0} with {1} cards ({2} copies each) -> valid={3}")
    @CsvSource({
            "TCG, 14, 3, true, ''",
            "TCG, 0, 0, false, 'Main Deck must contain between 40 and 60'",
            "TCG, 13, 3, false, 'Main Deck must contain between 40 and 60'",
            "TCG, 21, 3, false, 'Main Deck must contain between 40 and 60'",
            "GOAT, 21, 3, true, ''",
            "GOAT, 34, 3, false, 'Main Deck must contain between 40 and 100'",
            "SPEED_DUEL, 8, 3, true, ''",
            "SPEED_DUEL, 5, 3, false, 'Main Deck must contain between 20 and 30'",
            "SPEED_DUEL, 11, 3, false, 'Main Deck must contain between 20 and 30'"
    })
    @DisplayName("validate should enforce format-specific main deck size bounds")
    void validate_should_enforceFormatMainDeckSizeBounds(Format format, int cardCount, int qtyPerCard,
                                                        boolean shouldBeValid, String expectedErrorSubstring) {
        Deck deck = cardCount == 0
                ? new Deck("Empty Deck", "", format, null)
                : createBaseDeck(cardCount, qtyPerCard, format);
        if (cardCount == 0) {
            deck.setDeckCards(Collections.emptyList());
        }

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());

        if (shouldBeValid) {
            assertThat(errors).as("Expected valid deck for %s with %d cards", format, cardCount * qtyPerCard).isEmpty();
        } else {
            assertThat(errors).as("Expected validation errors for %s", format).isNotEmpty();
            assertThat(errors).anyMatch(e -> e.message().contains(expectedErrorSubstring));
        }
    }

    @ParameterizedTest(name = "Quantity {0} -> valid={1}")
    @CsvSource({
            "1, true",
            "2, true",
            "3, true",
            "4, false",
            "5, false"
    })
    @DisplayName("validate should enforce general 3-copy limit per card")
    void validate_should_enforceCopyLimit_when_quantityExceedsThree(int quantity, boolean shouldBeValid) {
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        Card card14 = new Card();
        card14.setId(14L);
        card14.setName("Card 14");
        card14.setType(CardType.NORMAL_MONSTER);
        deck.getDeckCards().add(new DeckCard(deck, card14, DeckSection.MAIN, quantity));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());

        if (shouldBeValid) {
            assertThat(errors).isEmpty();
        } else {
            assertThat(errors).isNotEmpty();
            assertThat(errors).anyMatch(e -> e.message().contains("exceeds the limit of 3 copies"));
        }
    }

    @ParameterizedTest(name = "Card status {0} with copies exceeding limit")
    @EnumSource(value = CardStatus.class, names = {"FORBIDDEN", "LIMITED", "SEMI_LIMITED"})
    @DisplayName("validate should enforce banlist status restrictions")
    void validate_should_enforceBanlistRestrictions_when_statusExceeded(CardStatus status) {
        Deck deck = createBaseDeck(14, 3, Format.GOAT); // Card 1 has 3 copies
        Map<Long, CardStatus> limits = new HashMap<>();
        limits.put(1L, status);

        List<ValidationError> errors = engine.validate(deck, limits);

        assertThat(errors).isNotEmpty();
        String expectedSnippet = switch (status) {
            case FORBIDDEN -> "is forbidden in format 'Goat'";
            case LIMITED -> "is limited in format 'Goat'";
            case SEMI_LIMITED -> "is semi-limited in format 'Goat'";
            default -> "";
        };
        assertThat(errors).anyMatch(e -> e.message().contains(expectedSnippet));
    }

    @ParameterizedTest(name = "CardType {0} in section {1} -> valid={2}")
    @CsvSource({
            "FUSION_MONSTER, MAIN, false, 'must be placed in the EXTRA section'",
            "SYNCHRO_MONSTER, MAIN, false, 'must be placed in the EXTRA section'",
            "XYZ_MONSTER, MAIN, false, 'must be placed in the EXTRA section'",
            "LINK_MONSTER, MAIN, false, 'must be placed in the EXTRA section'",
            "NORMAL_MONSTER, EXTRA, false, 'cannot be placed in the EXTRA section'",
            "SPELL_CARD, EXTRA, false, 'cannot be placed in the EXTRA section'",
            "TRAP_CARD, EXTRA, false, 'cannot be placed in the EXTRA section'"
    })
    @DisplayName("validate should enforce card section compatibility")
    void validate_should_enforceSectionCompatibility_when_cardTypePlacedInSection(CardType cardType,
                                                                                  DeckSection section,
                                                                                  boolean shouldBeValid,
                                                                                  String expectedErrorSubstring) {
        Deck deck = createBaseDeck(13, 3, Format.TCG);
        Card specialCard = new Card();
        specialCard.setId(14L);
        specialCard.setName("Special Card");
        specialCard.setType(cardType);
        deck.getDeckCards().add(new DeckCard(deck, specialCard, section, 1));

        List<ValidationError> errors = engine.validate(deck, Collections.emptyMap());

        if (shouldBeValid) {
            assertThat(errors).isEmpty();
        } else {
            assertThat(errors).isNotEmpty();
            assertThat(errors).anyMatch(e -> e.message().contains(expectedErrorSubstring));
        }
    }
}
