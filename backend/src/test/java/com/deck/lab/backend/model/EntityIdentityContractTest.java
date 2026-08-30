package com.deck.lab.backend.model;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests verifying the JPA Entity Identity Contract (equals and hashCode) across all domain
 * entities (Card, Deck, DeckCard, User, RefreshToken, FormatRules).
 */
@DisplayName("Entity Identity Contract Unit Tests")
class EntityIdentityContractTest {

    @Test
    @DisplayName("Card equals and hashCode contract should be compliant and support collection management")
    void card_should_adhereToIdentityContract() {
        Card card1 = new Card();
        card1.setId(1L);
        card1.setName("Dark Magician");

        Card card2 = new Card();
        card2.setId(1L);
        card2.setName("Dark Magician (Alternate Art)");

        Card card3 = new Card();
        card3.setId(1L);

        Card cardDifferent = new Card();
        cardDifferent.setId(2L);
        cardDifferent.setName("Blue-Eyes White Dragon");

        Card transientCard1 = new Card();
        Card transientCard2 = new Card();

        assertAll("Card identity contract assertions",
                // Reflexive
                () -> assertTrue(card1.equals(card1), "Reflexive: card1 should equal itself"),
                // Symmetric
                () -> assertTrue(card1.equals(card2) && card2.equals(card1),
                        "Symmetric: cards with same ID should be equal"),
                // Transitive
                () -> assertTrue(card1.equals(card2) && card2.equals(card3) && card1.equals(card3),
                        "Transitive: card1 equals card3"),
                // Non-nullity
                () -> assertFalse(card1.equals(null), "Non-nullity: card1 should not equal null"),
                // Type safety
                () -> assertFalse(card1.equals(new Object()),
                        "Type safety: card1 should not equal generic object"),
                // Different IDs
                () -> assertFalse(card1.equals(cardDifferent),
                        "Distinct IDs: cards with different IDs should not be equal"),
                // Transient entities
                () -> assertFalse(transientCard1.equals(transientCard2),
                        "Transient entities: distinct transient cards should not be equal"),
                // Hash code consistency
                () -> assertEquals(card1.hashCode(),
                        card2.hashCode(),
                        "HashCode: same class instances should have matching hash codes"));

        // Verify Set behavior before and after ID assignment
        Set<Card> cardSet = new HashSet<>();
        Card mutableCard = new Card();
        cardSet.add(mutableCard);
        assertTrue(cardSet.contains(mutableCard), "Set should contain transient card instance");

        mutableCard.setId(99L);
        assertTrue(cardSet.contains(mutableCard),
                "Set should still contain card after ID assignment");
    }

    @Test
    @DisplayName("Deck equals and hashCode contract should be compliant and support collection management")
    void deck_should_adhereToIdentityContract() {
        Deck deck1 = new Deck();
        deck1.setId(10L);
        deck1.setName("Dragon Turbo");

        Deck deck2 = new Deck();
        deck2.setId(10L);
        deck2.setName("Dragon Turbo Updated");

        Deck deck3 = new Deck();
        deck3.setId(10L);

        Deck deckDifferent = new Deck();
        deckDifferent.setId(20L);

        Deck transientDeck1 = new Deck();
        Deck transientDeck2 = new Deck();

        assertAll("Deck identity contract assertions",
                () -> assertTrue(deck1.equals(deck1), "Reflexive"),
                () -> assertTrue(deck1.equals(deck2) && deck2.equals(deck1), "Symmetric"),
                () -> assertTrue(deck1.equals(deck2) && deck2.equals(deck3) && deck1.equals(deck3),
                        "Transitive"),
                () -> assertFalse(deck1.equals(null), "Non-nullity"),
                () -> assertFalse(deck1.equals(new Object()), "Type safety"),
                () -> assertFalse(deck1.equals(deckDifferent), "Distinct IDs"),
                () -> assertFalse(transientDeck1.equals(transientDeck2), "Transient entities"),
                () -> assertEquals(deck1.hashCode(), deck2.hashCode(), "HashCode"));

        Set<Deck> deckSet = new HashSet<>();
        Deck mutableDeck = new Deck();
        deckSet.add(mutableDeck);
        assertTrue(deckSet.contains(mutableDeck));

        mutableDeck.setId(50L);
        assertTrue(deckSet.contains(mutableDeck));
    }

    @Test
    @DisplayName("DeckCard equals and hashCode contract should be compliant and support collection management")
    void deckCard_should_adhereToIdentityContract() {
        DeckCard dc1 = new DeckCard();
        dc1.setId(100L);
        dc1.setQuantity(3);

        DeckCard dc2 = new DeckCard();
        dc2.setId(100L);
        dc2.setQuantity(2);

        DeckCard dc3 = new DeckCard();
        dc3.setId(100L);

        DeckCard dcDifferent = new DeckCard();
        dcDifferent.setId(200L);

        DeckCard transientDc1 = new DeckCard();
        DeckCard transientDc2 = new DeckCard();

        assertAll("DeckCard identity contract assertions",
                () -> assertTrue(dc1.equals(dc1), "Reflexive"),
                () -> assertTrue(dc1.equals(dc2) && dc2.equals(dc1), "Symmetric"),
                () -> assertTrue(dc1.equals(dc2) && dc2.equals(dc3) && dc1.equals(dc3),
                        "Transitive"),
                () -> assertFalse(dc1.equals(null), "Non-nullity"),
                () -> assertFalse(dc1.equals(new Object()), "Type safety"),
                () -> assertFalse(dc1.equals(dcDifferent), "Distinct IDs"),
                () -> assertFalse(transientDc1.equals(transientDc2), "Transient entities"),
                () -> assertEquals(dc1.hashCode(), dc2.hashCode(), "HashCode"));

        Set<DeckCard> deckCardSet = new HashSet<>();
        DeckCard mutableDc = new DeckCard();
        deckCardSet.add(mutableDc);
        assertTrue(deckCardSet.contains(mutableDc));

        mutableDc.setId(300L);
        assertTrue(deckCardSet.contains(mutableDc));
    }

    @Test
    @DisplayName("User equals and hashCode contract should be compliant and support collection management")
    void user_should_adhereToIdentityContract() {
        User user1 = new User("admin", "pass1", "admin@example.com");
        user1.setId(1L);

        User user2 = new User("admin_updated", "pass2", "admin2@example.com");
        user2.setId(1L);

        User user3 = new User("admin_third", "pass3", "admin3@example.com");
        user3.setId(1L);

        User userDifferent = new User("yugi", "pass", "yugi@example.com");
        userDifferent.setId(2L);

        User transientUser1 = new User("kaiba", "pass", "kaiba@example.com");
        User transientUser2 = new User("joey", "pass", "joey@example.com");

        assertAll("User identity contract assertions",
                () -> assertTrue(user1.equals(user1), "Reflexive"),
                () -> assertTrue(user1.equals(user2) && user2.equals(user1), "Symmetric"),
                () -> assertTrue(user1.equals(user2) && user2.equals(user3) && user1.equals(user3),
                        "Transitive"),
                () -> assertFalse(user1.equals(null), "Non-nullity"),
                () -> assertFalse(user1.equals(new Object()), "Type safety"),
                () -> assertFalse(user1.equals(userDifferent), "Distinct IDs"),
                () -> assertFalse(transientUser1.equals(transientUser2), "Transient entities"),
                () -> assertEquals(user1.hashCode(), user2.hashCode(), "HashCode"));

        Set<User> userSet = new HashSet<>();
        User mutableUser = new User("temp", "pass", "temp@example.com");
        userSet.add(mutableUser);
        assertTrue(userSet.contains(mutableUser));

        mutableUser.setId(77L);
        assertTrue(userSet.contains(mutableUser));
    }

    @Test
    @DisplayName("RefreshToken equals and hashCode contract should be compliant and support collection management")
    void refreshToken_should_adhereToIdentityContract() {
        RefreshToken token1 = new RefreshToken();
        token1.setId(1000L);
        token1.setToken("token-abc");

        RefreshToken token2 = new RefreshToken();
        token2.setId(1000L);
        token2.setToken("token-def");

        RefreshToken token3 = new RefreshToken();
        token3.setId(1000L);

        RefreshToken tokenDifferent = new RefreshToken();
        tokenDifferent.setId(2000L);

        RefreshToken transientToken1 = new RefreshToken();
        RefreshToken transientToken2 = new RefreshToken();

        assertAll("RefreshToken identity contract assertions",
                () -> assertTrue(token1.equals(token1), "Reflexive"),
                () -> assertTrue(token1.equals(token2) && token2.equals(token1), "Symmetric"),
                () -> assertTrue(
                        token1.equals(token2) && token2.equals(token3) && token1.equals(token3),
                        "Transitive"),
                () -> assertFalse(token1.equals(null), "Non-nullity"),
                () -> assertFalse(token1.equals(new Object()), "Type safety"),
                () -> assertFalse(token1.equals(tokenDifferent), "Distinct IDs"),
                () -> assertFalse(transientToken1.equals(transientToken2), "Transient entities"),
                () -> assertEquals(token1.hashCode(), token2.hashCode(), "HashCode"));

        Set<RefreshToken> tokenSet = new HashSet<>();
        RefreshToken mutableToken = new RefreshToken();
        tokenSet.add(mutableToken);
        assertTrue(tokenSet.contains(mutableToken));

        mutableToken.setId(555L);
        assertTrue(tokenSet.contains(mutableToken));
    }

    @Test
    @DisplayName("FormatRules equals and hashCode contract should be compliant and support collection management")
    void formatRules_should_adhereToIdentityContract() {
        FormatRules rule1 = new FormatRules();
        rule1.setId(500L);
        rule1.setFormatName(Format.TCG);
        rule1.setStatus(CardStatus.FORBIDDEN);

        FormatRules rule2 = new FormatRules();
        rule2.setId(500L);
        rule2.setFormatName(Format.OCG);
        rule2.setStatus(CardStatus.LIMITED);

        FormatRules rule3 = new FormatRules();
        rule3.setId(500L);

        FormatRules ruleDifferent = new FormatRules();
        ruleDifferent.setId(600L);

        FormatRules transientRule1 = new FormatRules();
        FormatRules transientRule2 = new FormatRules();

        assertAll("FormatRules identity contract assertions",
                () -> assertTrue(rule1.equals(rule1), "Reflexive"),
                () -> assertTrue(rule1.equals(rule2) && rule2.equals(rule1), "Symmetric"),
                () -> assertTrue(rule1.equals(rule2) && rule2.equals(rule3) && rule1.equals(rule3),
                        "Transitive"),
                () -> assertFalse(rule1.equals(null), "Non-nullity"),
                () -> assertFalse(rule1.equals(new Object()), "Type safety"),
                () -> assertFalse(rule1.equals(ruleDifferent), "Distinct IDs"),
                () -> assertFalse(transientRule1.equals(transientRule2), "Transient entities"),
                () -> assertEquals(rule1.hashCode(), rule2.hashCode(), "HashCode"));

        Set<FormatRules> ruleSet = new HashSet<>();
        FormatRules mutableRule = new FormatRules();
        ruleSet.add(mutableRule);
        assertTrue(ruleSet.contains(mutableRule));

        mutableRule.setId(888L);
        assertTrue(ruleSet.contains(mutableRule));
    }
}
