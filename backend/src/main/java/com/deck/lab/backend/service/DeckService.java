package com.deck.lab.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.mapper.DeckMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.specification.DeckSpecification;

/**
 * Service managing user deck configuration lifecycles, database persistence,
 * and validation audits.
 *
 * <p>
 * <strong>Service Layer</strong>
 * </p>
 * <p>
 * Coordinates business workflows involving user deck list resources. Relies on
 * {@link DeckRepository} for database operations, {@link DeckValidationService}
 * to audit deck legality, and mappers to translate entity representations.
 * </p>
 *
 * <p>
 * <strong>Database Transaction Management with {@code @Transactional}:</strong>
 * </p>
 * <ul>
 * <li>Atomic Operations: Creating, updating, or deleting decks requires
 * modifying multiple tables concurrently (e.g., updates to {@code decks} and
 * batch deletes/inserts in {@code deck_cards}). By decorating service methods
 * with {@code @Transactional}, Spring configures a transaction proxy. If any
 * SQL write fails, or if a validation exception is raised mid-execution, Spring
 * triggers a database rollback, ensuring no partial or orphaned data corrupts
 * database consistency.</li>
 * </ul>
 */
@Service
public class DeckService {
    private final DeckRepository deckRepository;
    private final DeckMapper deckMapper;
    private final DeckValidationService deckValidationService;

    public DeckService(DeckRepository deckRepository,
            DeckMapper deckMapper,
            DeckValidationService deckValidationService) {
        this.deckRepository = deckRepository;
        this.deckMapper = deckMapper;
        this.deckValidationService = deckValidationService;
    }

    /**
     * Retrieves all distinct supported formats mapped as displayable strings.
     *
     * @return sorted list of supported format values
     */
    public List<String> findDistinctFormats() {
        return Stream.of(Format.values())
                .map(format -> format.getValue())
                .sorted()
                .toList();
    }

    /**
     * Finds and filters decks based on search parameters. Performs JPA Eager Card
     * fetches.
     *
     * @param name     optional substring match for the deck's name
     * @param format   optional exact match for the format name
     * @param username optional exact match for the owner's username
     * @return a list of sorted, matching DeckDto objects
     */
    public Page<DeckResponseDto> findAllWithFilters(String name, String format, String username, Pageable pageable) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and(DeckSpecification.hasName(name))
                .and(DeckSpecification.hasFormat(format))
                .and(DeckSpecification.hasUser(username));

        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by((Deck d) -> d.getUpdatedAt()).descending());
        }

        return deckRepository.findAll(spec, pageable).map(deckMapper::toDto);
    }

    /**
     * Verifies if a deck exists by its ID.
     *
     * @param id the unique deck ID
     * @return true if the deck exists in the database
     */
    public Boolean existsById(Long id) {
        return deckRepository.existsById(id);
    }

    /**
     * Retrieves a single deck by its ID.
     *
     * @param id the unique ID of the deck
     * @return mapped DeckDto
     * @throws NoSuchElementException if no deck is found matching the ID
     */
    public DeckResponseDto getDeckById(Long id) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and((root, query, builder) -> builder.equal(root.get("id"), id));
        Deck deck = deckRepository.findOne(spec)
                .orElseThrow(() -> new NoSuchElementException("Deck not found"));
        return deckMapper.toDto(deck);
    }

    /**
     * Validates a deck list against structural and format rules.
     *
     * @param deckDto the DTO deck representation to validate
     * @throws DeckValidationException if validation fails
     */
    public void validateDeck(DeckResponseDto deckDto) {
        deckValidationService.validate(deckDto);
    }

    /**
     * Creates and persists a new user deck. Validates format compliance first.
     *
     * @param deckDto the deck details to save
     * @param user    the owner user account
     * @return the saved DeckDto
     * @throws DeckValidationException if the deck format or size is invalid
     */
    @Transactional
    public DeckResponseDto createDeck(DeckResponseDto deckDto, User user) {
        Map<Long, Card> cardMap = deckValidationService.validate(deckDto);

        Deck deck = deckMapper.toEntity(deckDto);
        deck.setUser(user);

        saveDeckCards(deck, deckDto.getDeckCards(), cardMap);

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    /**
     * Updates and persists changes to an existing user deck. Checks user
     * authorization first.
     *
     * @param id      the ID of the deck to update
     * @param deckDto the updated deck details
     * @param user    the owner user requesting the change
     * @return the updated and saved DeckDto
     * @throws NoSuchElementException  if the deck doesn't exist or doesn't belong
     *                                 to the user
     * @throws DeckValidationException if the updated deck list is invalid
     */
    @Transactional
    public DeckResponseDto updateDeck(Long id, DeckResponseDto deckDto, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Deck not found or unauthorized"));

        Map<Long, Card> cardMap = deckValidationService.validate(deckDto);

        deckMapper.updateEntityFromDto(deckDto, deck);

        saveDeckCards(deck, deckDto.getDeckCards(), cardMap);

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    /**
     * Helper method to map and synchronize DeckCard items. Clears old references
     * and saves the newly mapped list.
     *
     * @param deck     the target Deck entity
     * @param cardDtos the list of DeckCardDto items to map
     * @param cardMap  pre-fetched database Cards keyed by ID
     * @throws IllegalArgumentException if a card specified in the DTO is missing
     *                                  from cardMap
     */
    public void saveDeckCards(Deck deck, List<DeckCardDto> cardDtos, Map<Long, Card> cardMap) {
        List<DeckCard> existingCards = deck.getDeckCards();
        List<DeckCard> cardsToKeep = new ArrayList<>();

        if (cardDtos != null && !cardDtos.isEmpty()) {
            for (DeckCardDto cardDto : cardDtos) {
                Card card = cardMap.get(cardDto.getCardId());
                if (card == null) {
                    throw new IllegalArgumentException("Card not found with ID: " + cardDto.getCardId());
                }

                DeckSection sectionEnum = null;
                try {
                    sectionEnum = cardDto.getSection() != null ? DeckSection.fromString(cardDto.getSection()) : null;
                } catch (IllegalArgumentException e) {
                    // Fallback/ignore invalid section
                }

                // Try to find an existing DeckCard matching by ID, or by (cardId + section)
                DeckCard existingMatch = null;
                if (cardDto.getId() != null) {
                    existingMatch = existingCards.stream()
                            .filter(dc -> cardDto.getId().equals(dc.getId()))
                            .findFirst()
                            .orElse(null);
                }

                // Fallback matching by cardId and section if ID matches weren't found or
                // weren't provided
                if (existingMatch == null) {
                    final DeckSection finalSectionEnum = sectionEnum;
                    existingMatch = existingCards.stream()
                            .filter(dc -> card.getId().equals(dc.getCard().getId())
                                    && finalSectionEnum == dc.getSection())
                            .findFirst()
                            .orElse(null);
                }

                if (existingMatch != null) {
                    // Update properties on the existing managed instance
                    existingMatch.setQuantity(cardDto.getQuantity());
                    existingMatch.setSection(sectionEnum);
                    cardsToKeep.add(existingMatch);
                } else {
                    // Create a new instance
                    DeckCard newDc = new DeckCard(deck, card, sectionEnum, cardDto.getQuantity());
                    cardsToKeep.add(newDc);
                }
            }
        }

        // Mutate the collection in-place so orphanRemoval deletes removed cards cleanly
        existingCards.removeIf(dc -> !cardsToKeep.contains(dc));
        for (DeckCard dc : cardsToKeep) {
            if (!existingCards.contains(dc)) {
                existingCards.add(dc);
            }
        }
    }

    /**
     * Deletes a deck from the database. Verifies user ownership.
     *
     * @param id   the ID of the deck to delete
     * @param user the owner user account requesting deletion
     * @throws NoSuchElementException if the deck is not found or user is
     *                                unauthorized
     */
    @Transactional
    public void deleteDeck(Long id, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Deck not found or unauthorized"));
        deckRepository.delete(deck);
    }
}