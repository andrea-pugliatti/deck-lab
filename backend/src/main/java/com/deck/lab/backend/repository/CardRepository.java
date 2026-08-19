package com.deck.lab.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.deck.lab.backend.model.Card;

/**
 * JPA Repository interface for managing {@link Card} database records.
 *
 * <p>
 * <strong>Repository Pattern (Data Access Layer)</strong>
 * </p>
 * <p>
 * By extending {@link JpaRepository}, Spring Data JPA automatically generates the underlying JDBC
 * boilerplates, SQL connections, and result-set mappings at application load time. It exposes
 * standard database CRUD operations.
 * </p>
 *
 * <p>
 * <strong>JPA Specification Execution via {@link JpaSpecificationExecutor}:</strong>
 * </p>
 * <p>
 * By extending {@code JpaSpecificationExecutor}, the repository gains overloaded query capabilities
 * (like {@code findAll(Specification, Pageable)}) allowing it to process programmatically chained
 * search criteria. This is crucial for enabling the dynamic paginated search system used in card
 * catalog listings.
 * </p>
 * <p>
 * <strong>Specification Pattern Integration:</strong>
 * </p>
 * <p>
 * By also extending {@link JpaSpecificationExecutor}, the repository gains dynamic querying
 * capabilities. This allows filtering cards by compound, optional predicates (such as matching card
 * types, attributes, and archetypes) configured programmatically at runtime across multiple catalog
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
     * Resolves cards whose names are in the given list.
     *
     * @param names list of card names
     * @return list of matching Cards
     */
    List<Card> findByNameIn(List<String> names);

    /**
     * Resolves cards whose name contains the search substring (case-insensitive). Used for fallback
     * searches.
     *
     * @param name substring to match
     * @return list of matching Cards
     */
    List<Card> findByNameContainingIgnoreCase(String name);

    /**
     * Resolves a card by exact matching passcode.
     *
     * @param passcode exact passcode of the card
     * @return Optional containing the Card if found
     */
    Optional<Card> findByPasscode(Long passcode);

    /**
     * Resolves cards whose passcodes are in the given list.
     *
     * @param passcodes list of card passcodes
     * @return list of matching Cards
     */
    List<Card> findByPasscodeIn(List<Long> passcodes);

    /**
     * Retrieves all unique archetype strings projected directly from the database in sorted order.
     *
     * @return sorted list of distinct archetype strings
     */
    @Query("SELECT DISTINCT c.archetype FROM Card c WHERE c.archetype IS NOT NULL AND TRIM(c.archetype) <> '' ORDER BY c.archetype ASC")
    List<String> findDistinctArchetypes();

}
