package com.deck.lab.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.User;

/**
 * JPA Repository interface for managing {@link Deck} database records.
 *
 * <p>
 * <strong>Repository Pattern (Data Access Layer)</strong>
 * </p>
 * <p>
 * Exposes persistent CRUD query routines for deck configurations. Extending
 * {@link JpaRepository} delegates SQL queries to the underlying database
 * engine, enabling saving, updating, and querying user decks.
 * </p>
 *
 * <p>
 * <strong>Dynamic Query Execution with
 * {@link JpaSpecificationExecutor}:</strong>
 * </p>
 * <p>
 * Enables the repository to evaluate dynamic specifications (like matching
 * names or filtering by format and owner), combining filters dynamically in the
 * service layer to avoid declaring complex static finder permutations.
 * </p>
 */
public interface DeckRepository extends JpaRepository<Deck, Long>, JpaSpecificationExecutor<Deck> {

    /**
     * Resolves all decks created by a specific user.
     *
     * @param user owner user account context
     * @return list of decks
     */
    List<Deck> findByUser(User user);

    /**
     * Resolves a deck by its ID and validates user ownership.
     *
     * @param id   the unique ID of the deck
     * @param user owner user account context
     * @return Optional containing the Deck if found and authorized
     */
    Optional<Deck> findByIdAndUser(Long id, User user);
}
