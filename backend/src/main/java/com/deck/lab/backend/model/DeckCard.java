package com.deck.lab.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

/**
 * Association entity representing a specific card entry within a user's deck
 * list.
 *
 * <p>
 * <strong>Composite Association Class (Junction Entity with Payload)</strong>
 * </p>
 * <p>
 * Standard many-to-many relationships (like Decks containing Cards) do not
 * easily support additional column attributes (such as which deck section a
 * card belongs to, or how many copies of the card are in the deck). To solve
 * this, we promote the relationship into a first-class JPA entity called
 * {@code DeckCard}. This acts as a junction table connecting the {@link Deck}
 * and {@link Card} entities while housing payload attributes like
 * {@code section} (e.g. MAIN/EXTRA/SIDE) and {@code quantity} copies.
 * </p>
 *
 * <p>
 * <strong>Mapping Concepts:</strong>
 * </p>
 * <ul>
 * <li>{@code @ManyToOne(fetch = FetchType.LAZY)}: Minimizes database query load
 * by only fetching card or deck details when explicitly requested in code.</li>
 * <li>{@code @JsonIgnore}: Applied to the {@code deck} field to prevent
 * infinite recursion serialization loops. Without this, serializing a
 * {@code Deck} would serialize its list of {@code DeckCard} objects, which
 * would serialize the parent {@code Deck} again, eventually causing a stack
 * overflow exception ({@code StackOverflowError}).</li>
 * <li>{@code @Enumerated(EnumType.STRING)}: Serializes the {@link DeckSection}
 * enum to its name string in the database column, preserving readability and
 * avoiding database value mismatch if enum ordering changes.</li>
 * </ul>
 */
@Entity
@Table(name = "deck_cards")
public class DeckCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    @JsonIgnore
    private Deck deck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DeckSection section;

    @NotNull
    private Integer quantity;

    public DeckCard() {
    }

    public DeckCard(Deck deck, Card card, DeckSection section, Integer quantity) {
        this.deck = deck;
        this.card = card;
        this.section = section;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Deck getDeck() {
        return deck;
    }

    public void setDeck(Deck deck) {
        this.deck = deck;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public DeckSection getSection() {
        return section;
    }

    public void setSection(DeckSection section) {
        this.section = section;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
