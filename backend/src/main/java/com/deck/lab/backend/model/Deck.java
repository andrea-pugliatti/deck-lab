package com.deck.lab.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Domain model entity representing a user's deck list configuration.
 *
 * <p>
 * <strong>JPA Entity (Domain Model)</strong>
 * </p>
 * <p>
 * Maps a collection of cards (a deck) associated with a specific owner (user)
 * and configured for a specific gameplay format. Relies on bidirectional
 * relations and entity lifecycle listeners to ensure database consistency.
 * </p>
 *
 * <p>
 * <strong>JPA Mapping Patterns:</strong>
 * </p>
 * <ul>
 * <li>{@code @ManyToOne(fetch = FetchType.LAZY)}: Models a many-to-one
 * relationship between Decks and Users.
 * Using {@code FetchType.LAZY} ensures that Hibernate does not query and load
 * the full {@link User} entity unless
 * its fields are explicitly accessed in code, preventing performance
 * degradation ("N+1 Query Problem").</li>
 * <li>{@code @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)}:
 * Models the deck's card slots.
 * <ul>
 * <li>{@code mappedBy}: Designates the child class {@link DeckCard} as the
 * owner of the relationship.</li>
 * <li>{@code CascadeType.ALL}: Ensures persistence operations (saving,
 * updating, deleting) on this deck automatically propagate to child card
 * entries.</li>
 * <li>{@code orphanRemoval = true}: Ensures that if a card entry is removed
 * from this list, JPA automatically deletes that record from the database.</li>
 * </ul>
 * </li>
 * <li>{@code @PrePersist} and {@code @PreUpdate}: Lifecycle callback
 * annotations.
 * These trigger methods automatically before writing (persisting) or updating
 * database records, allowing automatic auditing of creation and modification
 * timestamps.</li>
 * </ul>
 */
@Entity
@Table(name = "decks")
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "format_name", nullable = false)
    private Format formatName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeckCard> deckCards = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Deck() {
    }

    public Deck(String name, String description, Format formatName, User user) {
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Format getFormatName() {
        return formatName;
    }

    public void setFormatName(Format formatName) {
        this.formatName = formatName;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<DeckCard> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCard> deckCards) {
        this.deckCards = deckCards;
    }
}
