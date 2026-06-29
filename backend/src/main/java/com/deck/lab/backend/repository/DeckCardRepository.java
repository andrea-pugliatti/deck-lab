package com.deck.lab.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.DeckCard;

/**
 * JPA Repository interface for managing {@link DeckCard} database records.
 *
 * <p>
 * <strong>Repository Pattern (Junction Table Adapter)</strong>
 * </p>
 * <p>
 * Manages persistence operations for the deck-card association slots. Because
 * most list updates are handled cascades from the parent {@link Deck} entity
 * (via {@code CascadeType.ALL}), this repository is primarily leveraged for
 * individual slot queries, target auditing, or isolated record deletions
 * outside the parent lifecycle context.
 * </p>
 */
public interface DeckCardRepository extends JpaRepository<DeckCard, Long> {
}
