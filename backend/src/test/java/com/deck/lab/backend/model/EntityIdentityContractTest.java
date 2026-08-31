package com.deck.lab.backend.model;

import static org.assertj.core.api.Assertions.assertThat;

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

        // Reflexive
        assertThat(card1).isEqualTo(card1);
        // Symmetric
        assertThat(card1).isEqualTo(card2);
        assertThat(card2).isEqualTo(card1);
        // Transitive
        assertThat(card1).isEqualTo(card3);
        assertThat(card2).isEqualTo(card3);
        // Non-nullity
        assertThat(card1).isNotEqualTo(null);
        // Type safety
        assertThat(card1).isNotEqualTo(new Object());
        // Different IDs
        assertThat(card1).isNotEqualTo(cardDifferent);
        // Transient entities
        assertThat(transientCard1).isNotEqualTo(transientCard2);
        // Hash code consistency
        assertThat(card1.hashCode()).isEqualTo(card2.hashCode());

        // Verify Set behavior before and after ID assignment
        Set<Card> cardSet = new HashSet<>();
        Card mutableCard = new Card();
        cardSet.add(mutableCard);
        assertThat(cardSet).contains(mutableCard);

        mutableCard.setId(99L);
        assertThat(cardSet).contains(mutableCard);
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

        assertThat(deck1).isEqualTo(deck1);
        assertThat(deck1).isEqualTo(deck2);
        assertThat(deck2).isEqualTo(deck1);
        assertThat(deck1).isEqualTo(deck3);
        assertThat(deck2).isEqualTo(deck3);
        assertThat(deck1).isNotEqualTo(null);
        assertThat(deck1).isNotEqualTo(new Object());
        assertThat(deck1).isNotEqualTo(deckDifferent);
        assertThat(transientDeck1).isNotEqualTo(transientDeck2);
        assertThat(deck1.hashCode()).isEqualTo(deck2.hashCode());

        Set<Deck> deckSet = new HashSet<>();
        Deck mutableDeck = new Deck();
        deckSet.add(mutableDeck);
        assertThat(deckSet).contains(mutableDeck);

        mutableDeck.setId(50L);
        assertThat(deckSet).contains(mutableDeck);
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

        assertThat(dc1).isEqualTo(dc1);
        assertThat(dc1).isEqualTo(dc2);
        assertThat(dc2).isEqualTo(dc1);
        assertThat(dc1).isEqualTo(dc3);
        assertThat(dc2).isEqualTo(dc3);
        assertThat(dc1).isNotEqualTo(null);
        assertThat(dc1).isNotEqualTo(new Object());
        assertThat(dc1).isNotEqualTo(dcDifferent);
        assertThat(transientDc1).isNotEqualTo(transientDc2);
        assertThat(dc1.hashCode()).isEqualTo(dc2.hashCode());

        Set<DeckCard> deckCardSet = new HashSet<>();
        DeckCard mutableDc = new DeckCard();
        deckCardSet.add(mutableDc);
        assertThat(deckCardSet).contains(mutableDc);

        mutableDc.setId(300L);
        assertThat(deckCardSet).contains(mutableDc);
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

        assertThat(user1).isEqualTo(user1);
        assertThat(user1).isEqualTo(user2);
        assertThat(user2).isEqualTo(user1);
        assertThat(user1).isEqualTo(user3);
        assertThat(user2).isEqualTo(user3);
        assertThat(user1).isNotEqualTo(null);
        assertThat(user1).isNotEqualTo(new Object());
        assertThat(user1).isNotEqualTo(userDifferent);
        assertThat(transientUser1).isNotEqualTo(transientUser2);
        assertThat(user1.hashCode()).isEqualTo(user2.hashCode());

        Set<User> userSet = new HashSet<>();
        User mutableUser = new User("temp", "pass", "temp@example.com");
        userSet.add(mutableUser);
        assertThat(userSet).contains(mutableUser);

        mutableUser.setId(77L);
        assertThat(userSet).contains(mutableUser);
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

        assertThat(token1).isEqualTo(token1);
        assertThat(token1).isEqualTo(token2);
        assertThat(token2).isEqualTo(token1);
        assertThat(token1).isEqualTo(token3);
        assertThat(token2).isEqualTo(token3);
        assertThat(token1).isNotEqualTo(null);
        assertThat(token1).isNotEqualTo(new Object());
        assertThat(token1).isNotEqualTo(tokenDifferent);
        assertThat(transientToken1).isNotEqualTo(transientToken2);
        assertThat(token1.hashCode()).isEqualTo(token2.hashCode());

        Set<RefreshToken> tokenSet = new HashSet<>();
        RefreshToken mutableToken = new RefreshToken();
        tokenSet.add(mutableToken);
        assertThat(tokenSet).contains(mutableToken);

        mutableToken.setId(555L);
        assertThat(tokenSet).contains(mutableToken);
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

        assertThat(rule1).isEqualTo(rule1);
        assertThat(rule1).isEqualTo(rule2);
        assertThat(rule2).isEqualTo(rule1);
        assertThat(rule1).isEqualTo(rule3);
        assertThat(rule2).isEqualTo(rule3);
        assertThat(rule1).isNotEqualTo(null);
        assertThat(rule1).isNotEqualTo(new Object());
        assertThat(rule1).isNotEqualTo(ruleDifferent);
        assertThat(transientRule1).isNotEqualTo(transientRule2);
        assertThat(rule1.hashCode()).isEqualTo(rule2.hashCode());

        Set<FormatRules> ruleSet = new HashSet<>();
        FormatRules mutableRule = new FormatRules();
        ruleSet.add(mutableRule);
        assertThat(ruleSet).contains(mutableRule);

        mutableRule.setId(888L);
        assertThat(ruleSet).contains(mutableRule);
    }
}
