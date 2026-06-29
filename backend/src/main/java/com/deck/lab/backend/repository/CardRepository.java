package com.deck.lab.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.deck.lab.backend.model.Card;

/**
 * JPA Repository interface for managing {@link Card} database records.
 *
 * <p>
 * <strong>Repository Pattern (Data Access Layer)</strong>
 * </p>
 * <p>
 * By extending {@link JpaRepository}, Spring Data JPA automatically generates
 * the underlying JDBC boilerplates, SQL connections, and result-set mappings at
 * application load time. It exposes standard database CRUD operations.
 * </p>
 *
 * <p>
 * <strong>JPA Specification Execution via
 * {@link JpaSpecificationExecutor}:</strong>
 * </p>
 * <p>
 * By extending {@code JpaSpecificationExecutor}, the repository gains
 * overloaded query capabilities (like {@code findAll(Specification, Pageable)})
 * allowing it to process programmatically chained search criteria. This is
 * crucial for enabling the dynamic paginated search system used in card catalog
 * listings.
 * </p>
 */
public interface CardRepository extends JpaRepository<Card, Long>, JpaSpecificationExecutor<Card> {

        /**
         * Resolves a card by exact matching name.
         *
         * @param name exact name string of the card
         * @return Optional containing the Card if found
         */
        Optional<Card> findByName(String name);

        /**
         * Resolves cards whose name contains the search substring (case-insensitive).
         * Used for fallback searches.
         *
         * @param name substring to match
         * @return list of matching Cards
         */
        List<Card> findByNameContainingIgnoreCase(String name);

        /**
         * Retrieves all unique cards having a non-null and non-empty archetype string.
         * Used to build search filter lists.
         *
         * @param empty the empty boundary string to exclude
         * @return list of Cards with distinct archetypes
         */
        List<Card> findDistinctByArchetypeNotNullAndArchetypeNot(String empty);
}
