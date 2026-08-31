package com.deck.lab.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.specification.CardSpecification;

/**
 * Service handling query operations and persistence updates for Yu-Gi-Oh! card catalog entries.
 *
 * <p>
 * <strong>Design Pattern: Service Layer</strong>
 * </p>
 * <p>
 * Acts as an intermediary coordinator between controllers querying cards and the data access
 * layers. It encapsulates read-only static listings (such as distinct card attributes, archetypes,
 * and types) along with paginated database searches.
 * </p>
 *
 * <p>
 * <strong>JPA Specifications Integration:</strong>
 * </p>
 * <ul>
 * <li>Dynamic Query Building: Rather than hardcoding multiple repository methods (e.g., query by
 * name, query by type, etc.), this service leverages JPA
 * {@link org.springframework.data.jpa.domain.Specification} interfaces. Specifications encapsulate
 * query criteria programmatically based on the JPA Criteria API, enabling this class to dynamically
 * combine filters (AND/OR clauses) at runtime depending on the parameters supplied in HTTP
 * requests.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;

    /**
     * Constructs a new {@link CardService} with the required card repository.
     *
     * @param cardRepository the repository for card database operations
     */
    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Maps and retrieves a sorted list of all distinct card attributes.
     *
     * @return the sorted list of distinct attribute name strings
     */
    public List<String> findDistinctAttributes() {
        return Stream.of(CardAttribute.values())
                .map(cardAttribute -> cardAttribute.getValue())
                .sorted()
                .toList();
    }

    /**
     * Maps and retrieves a sorted list of all distinct card races.
     *
     * @return the sorted list of distinct race and type name strings
     */
    public List<String> findDistinctRaces() {
        return Stream.of(CardRace.values())
                .map(cardRace -> cardRace.getValue())
                .sorted()
                .toList();
    }

    /**
     * Queries and filters the database to retrieve all distinct card archetypes. Cached to avoid
     * repetitive database execution.
     *
     * @return the sorted list of unique archetype name strings
     */
    @Cacheable("archetypes")
    public List<String> findDistinctArchetypes() {
        return cardRepository.findDistinctArchetypes();
    }

    /**
     * Maps and retrieves a sorted list of all distinct card types.
     *
     * @return the sorted list of distinct card type values
     */
    public List<String> findDistinctTypes() {
        return Stream.of(CardType.values()).map(cardType -> cardType.getValue()).sorted().toList();
    }

    /**
     * Finds and filters cards matching search criteria. Returns a paginated list.
     *
     * @param name      the optional name substring match
     * @param type      the optional card type exact match
     * @param attribute the optional card attribute exact match
     * @param race      the optional card race exact match
     * @param archetype the optional card archetype exact match
     * @param pageable  the pagination information
     * @return a page of matching Card entities
     */
    public Page<Card> findAllOrWithFilters(String name,
                                           String type,
                                           String attribute,
                                           String race,
                                           String archetype,
                                           Pageable pageable) {
        Specification<Card> spec = Specification
                .where(CardSpecification.hasName(name))
                .and(CardSpecification.hasType(type))
                .and(CardSpecification.hasAttribute(attribute))
                .and(CardSpecification.hasRace(race))
                .and(CardSpecification.hasArchetype(archetype));
        return cardRepository.findAll(spec, pageable);
    }

    /**
     * Searches database for a card by ID.
     *
     * @param id the unique card ID
     * @return the optional containing the Card entity if found
     */
    public Optional<Card> findById(Long id) {
        return cardRepository.findById(id);
    }

    /**
     * Retrieves a single Card entity by its unique ID.
     *
     * @param id the unique card ID
     * @return the Card entity matching the specified ID
     * @throws ResourceNotFoundException if no card matches the ID
     */
    public Card getById(Long id) {
        return findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found with id: " + id));
    }

    /**
     * Persists a new Card entry in the database.
     *
     * @param card the Card entity to save
     * @return the saved Card entity
     */
    @Transactional
    public Card save(Card card) {
        return cardRepository.save(card);
    }

    /**
     * Modifies and updates an existing Card entry.
     *
     * @param card the Card entity containing updates
     * @return the updated Card entity
     */
    @Transactional
    public Card edit(Card card) {
        return cardRepository.save(card);
    }

    /**
     * Deletes a Card record from database by its ID.
     *
     * @param id the ID of the card to delete
     * @throws ResourceNotFoundException if no card matches the ID
     */
    @Transactional
    public void deleteById(Long id) {
        Card card = getById(id);
        cardRepository.delete(card);
    }
}
