package com.deck.lab.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.deck.lab.backend.dto.CardDto;
import com.deck.lab.backend.mapper.CardMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.service.CardService;

import jakarta.validation.Valid;

/**
 * REST Controller providing API endpoints for querying and managing Yu-Gi-Oh!
 * Cards.
 *
 * <p>
 * <strong>Controller (REST API)</strong>
 * </p>
 * <p>
 * Exposes endpoints to query the card catalog. Relies on {@link CardService}
 * for data retrieval and uses MapStruct {@link CardMapper} to translate
 * database entities ({@link Card}) into client-safe DTO structures
 * ({@link CardDto}).
 * </p>
 *
 * <p>
 * <strong>Spring Data Pagination & Query Features:</strong>
 * </p>
 * <ul>
 * <li>{@code Pageable} & {@code Page}: Database tables containing thousands of
 * records (like card catalogs) must never be queried entirely. This controller
 * uses Spring Data's pagination mechanisms. By passing parameters like
 * {@code page} and {@code size}, Spring builds limit/offset SQL queries under
 * the hood, returning a {@link Page} structure containing both the sublist and
 * metadata (total elements, total pages) so that clients can build dynamic
 * pagination UIs.</li>
 * <li>Dynamic Filtering: API endpoints support passing optional query
 * parameters (e.g. name, type, race, attribute) which are translated into
 * database search criteria using JPA Specifications.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService service;
    private final CardMapper mapper;

    CardController(
            CardService cardService,
            CardMapper cardMapper) {
        this.service = cardService;
        this.mapper = cardMapper;
    }

    /**
     * Retrieves a paginated list of cards filtered by search criteria.
     *
     * @param name      optional name substring filter
     * @param type      optional card type exact match filter
     * @param attribute optional card attribute exact match filter
     * @param race      optional card race/type exact match filter
     * @param archetype optional card archetype exact match filter
     * @param page      zero-indexed page number (default 0)
     * @param size      page size (default 20)
     * @return a page of matching CardDto records
     */
    @GetMapping
    public ResponseEntity<Page<CardDto>> index(
            @RequestParam(value = "q", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "attribute", required = false) String attribute,
            @RequestParam(value = "race", required = false) String race,
            @RequestParam(value = "archetype", required = false) String archetype,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CardDto> cards = service
                .findAllOrWithFilters(name, type, attribute, race, archetype, pageable)
                .map(mapper::toDto);

        return ResponseEntity.ok(cards);
    }

    /**
     * Retrieves details of a single card by its unique ID.
     *
     * @param id the unique ID of the card
     * @return 200 OK with CardDto, or 404 Not Found if card doesn't exist
     */
    @GetMapping("/{id}")
    public ResponseEntity<CardDto> show(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDto(service.getById(id)));
    }

    /**
     * Creates a new card entry in the database.
     *
     * @param cardDto the card definition details
     * @return 201 Created with the saved CardDto
     */
    @PostMapping
    public ResponseEntity<CardDto> create(@Valid @RequestBody CardDto cardDto) {
        Card card = mapper.toEntity(cardDto);
        Card savedCard = service.save(card);
        return new ResponseEntity<>(mapper.toDto(savedCard), HttpStatus.CREATED);
    }

    /**
     * Updates details of an existing card entry.
     *
     * @param id      the ID of the card to update
     * @param cardDto the updated card details
     * @return 200 OK with the updated CardDto, or 404 Not Found if card doesn't
     *         exist
     */
    @PutMapping("/{id}")
    public ResponseEntity<CardDto> update(@PathVariable Long id, @Valid @RequestBody CardDto cardDto) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Card existingCard = service.getById(id);
        mapper.updateEntityFromDto(cardDto, existingCard);
        Card updatedCard = service.edit(existingCard);
        return ResponseEntity.ok(mapper.toDto(updatedCard));
    }

    /**
     * Deletes a card entry by its ID.
     *
     * @param id the ID of the card to delete
     * @return 204 No Content on success, or 404 Not Found if card doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves all distinct card attributes present in the game (e.g. LIGHT, DARK,
     * FIRE).
     *
     * @return list of attribute name strings
     */
    @GetMapping("/attributes")
    public ResponseEntity<List<String>> getAttributes() {
        return ResponseEntity.ok(service.findDistinctAttributes());
    }

    /**
     * Retrieves all distinct card races present in the game (e.g. Spellcaster,
     * Dragon, Warrior).
     *
     * @return list of race/type name strings
     */
    @GetMapping("/races")
    public ResponseEntity<List<String>> getRaces() {
        return ResponseEntity.ok(service.findDistinctRaces());
    }

    /**
     * Retrieves all distinct card archetypes indexed in the database (e.g.
     * Blue-Eyes, Elemental HERO).
     *
     * @return list of archetype name strings
     */
    @GetMapping("/archetypes")
    public ResponseEntity<List<String>> getArchetypes() {
        return ResponseEntity.ok(service.findDistinctArchetypes());
    }

    /**
     * Retrieves all distinct card classification types (e.g. Spell Card, Trap Card,
     * Normal Monster).
     *
     * @return list of card type strings
     */
    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        return ResponseEntity.ok(service.findDistinctTypes());
    }
}
