package com.deck.lab.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.specification.CardSpecification;

/**
 * Service handling query operations and persistence updates for Yu-Gi-Oh! card
 * catalog entries.
 *
 * <p>
 * <strong>Design Pattern: Service Layer</strong>
 * </p>
 * <p>
 * Acts as an intermediary coordinator between controllers querying cards and
 * the data access layers.
 * It encapsulates read-only static listings (such as distinct card attributes,
 * archetypes, and types)
 * along with paginated database searches.
 * </p>
 *
 * <p>
 * <strong>JPA Specifications Integration:</strong>
 * </p>
 * <ul>
 * <li>Dynamic Query Building: Rather than hardcoding multiple repository
 * methods (e.g., query by name, query by type, etc.),
 * this service leverages JPA
 * {@link org.springframework.data.jpa.domain.Specification} interfaces.
 * Specifications encapsulate query criteria
 * programmatically based on the JPA Criteria API, enabling this class to
 * dynamically combine filters (AND/OR clauses) at runtime
 * depending on the parameters supplied in HTTP requests.</li>
 * </ul>
 */
@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Maps and retrieves a sorted list of all distinct card attributes.
     *
     * @return sorted list of attribute name strings
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
     * @return sorted list of race/type name strings
     */
    public List<String> findDistinctRaces() {
        return Stream.of(CardRace.values())
                .map(cardRace -> cardRace.getValue())
                .sorted()
                .toList();
    }

    /**
     * Queries and filters the database to retrieve all distinct card archetypes.
     *
     * @return sorted list of unique archetype name strings
     */
    public List<String> findDistinctArchetypes() {
        return cardRepository.findDistinctByArchetypeNotNullAndArchetypeNot("").stream()
                .map(card -> card.getArchetype())
                .filter(a -> a != null && !a.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Maps and retrieves a sorted list of all distinct card types.
     *
     * @return sorted list of card type values
     */
    public List<String> findDistinctTypes() {
        return Stream.of(CardType.values())
                .map(cardType -> cardType.getValue())
                .sorted()
                .toList();
    }

    /**
     * Finds and filters cards matching search criteria. Returns a paginated list.
     *
     * @param name      optional name substring match
     * @param type      optional card type exact match
     * @param attribute optional card attribute exact match
     * @param race      optional card race exact match
     * @param archetype optional card archetype exact match
     * @param pageable  pagination details
     * @return a page of matching Card entities
     */
    public Page<Card> findAllOrWithFilters(String name, String type, String attribute, String race, String archetype,
            Pageable pageable) {
        Specification<Card> spec = Specification.where(
                CardSpecification.hasName(name))
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
     * @return Optional containing the Card entity if found
     */
    public Optional<Card> findById(Long id) {
        return cardRepository.findById(id);
    }

    /**
     * Verifies if a card exists by its ID.
     *
     * @param id the unique card ID
     * @return true if the card exists
     */
    public Boolean existsById(Long id) {
        return cardRepository.existsById(id);
    }

    /**
     * Retrieves a single Card entity by its unique ID.
     *
     * @param id the unique card ID
     * @return Card entity
     * @throws ResourceNotFoundException if no card matches the ID
     */
    public Card getById(Long id) {
        return findById(id).orElseThrow(() -> new ResourceNotFoundException("Card not found with id: " + id));
    }

    /**
     * Persists a new Card entry in the database.
     *
     * @param card the Card entity to save
     * @return the saved Card entity
     */
    public Card save(Card card) {
        return cardRepository.save(card);
    }

    /**
     * Modifies and updates an existing Card entry.
     *
     * @param card the Card entity containing updates
     * @return the updated Card entity
     */
    public Card edit(Card card) {
        return cardRepository.save(card);
    }

    /**
     * Deletes a Card record from database by its ID.
     *
     * @param id the ID of the card to delete
     */
    public void deleteById(Long id) {
        if (cardRepository.existsById(id)) {
            cardRepository.deleteById(id);
        }
    }
}
