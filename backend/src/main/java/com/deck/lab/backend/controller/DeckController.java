package com.deck.lab.backend.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.dto.response.YdkImportResponseDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.exception.YdkImportException;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.service.DeckService;
import com.deck.lab.backend.service.YdkService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * REST Controller providing API endpoints for managing user decks and decklists.
 *
 * <p>
 * <strong>Controller (REST API)</strong>
 * </p>
 * <p>
 * Exposes CRUD operations and validation services targeting deck resources. Relies on
 * {@link DeckService} to validate, save, query, and modify user decks while translating entities
 * to/from {@link DeckResponseDto}.
 * </p>
 *
 * <p>
 * <strong>Spring Security Integration:</strong>
 * </p>
 * <ul>
 * <li>{@code @AuthenticationPrincipal}: Instructs Spring Security to extract the currently
 * authenticated user session principal (which is our custom {@link User} entity) from the security
 * context and bind it directly to the controller method argument. This prevents manual security
 * context lookups and ensures requests are scoped to the authenticated caller.</li>
 * <li>Transactional Boundaries: Coordinates request verification with nested card validation
 * parameters before invoking service logic.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService deckService;
    private final YdkService ydkService;
    private final RateLimiter deckValidationRateLimiter;
    private final RateLimiter deckSaveRateLimiter;

    public DeckController(DeckService deckService,
                          YdkService ydkService,
                          @Qualifier("deckValidationRateLimiter") RateLimiter deckValidationRateLimiter,
                          @Qualifier("deckSaveRateLimiter") RateLimiter deckSaveRateLimiter) {
        this.deckService = deckService;
        this.ydkService = ydkService;
        this.deckValidationRateLimiter = deckValidationRateLimiter;
        this.deckSaveRateLimiter = deckSaveRateLimiter;
    }

    /**
     * Retrieves a page of decks filtered by name, format, or owner's username.
     *
     * @param name     optional substring filter for the deck name
     * @param format   optional exact match filter for the format name
     * @param username optional exact match filter for the deck creator's username
     * @param page     zero-indexed page number (default 0)
     * @param size     page size (default 20)
     * @return a page of matching DeckDto records
     */
    @GetMapping
    public ResponseEntity<Page<DeckResponseDto>>
            index(@RequestParam(value = "q", required = false) String name,
                  @RequestParam(value = "format", required = false) String format,
                  @RequestParam(value = "username", required = false) String username,
                  @RequestParam(value = "page", defaultValue = "0") int page,
                  @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(deckService.findAllWithFilters(name, format, username, pageable));
    }

    /**
     * Retrieves a single deck by its unique ID.
     *
     * @param id the unique ID of the deck to retrieve
     * @return 200 OK with the DeckDto, or 404 Not Found if the ID does not exist
     */
    @GetMapping("/{id}")
    public ResponseEntity<DeckResponseDto> show(@PathVariable Long id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    /**
     * Creates a new deck for the currently authenticated user.
     *
     * @param deckDto the deck definition data containing cards and format details
     * @param user    the authenticated user owning the new deck
     * @return 201 Created with the saved DeckDto
     * @throws DeckValidationException if the deck violates format or size rules
     */
    @PostMapping
    public ResponseEntity<DeckResponseDto> create(@Valid @RequestBody DeckSaveRequestDto deckDto,
                                                  @AuthenticationPrincipal User user) {
        deckSaveRateLimiter.checkLimit("user:" + user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deckService.createDeck(deckDto, user));
    }

    /**
     * Validates a deck list against game and format rules without saving it.
     *
     * @param deckDto the deck definition to validate
     * @return 200 OK if the deck is valid
     * @throws DeckValidationException containing validation errors if invalid
     */
    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@Valid @RequestBody DeckSaveRequestDto deckDto,
                                         @AuthenticationPrincipal User user,
                                         HttpServletRequest servletRequest) {
        String key = (user != null)
                ? "user:" + user.getId()
                : "ip:" + servletRequest.getRemoteAddr();
        deckValidationRateLimiter.checkLimit(key);
        deckService.validateDeck(deckDto);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing deck owned by the currently authenticated user.
     *
     * @param id      the ID of the deck to update
     * @param deckDto the updated deck definition data
     * @param user    the authenticated user requesting the update
     * @return 200 OK with the updated DeckDto, or 404 Not Found if the deck doesn't exist
     * @throws NoSuchElementException  if the deck is not found or user is unauthorized
     * @throws DeckValidationException if the updated deck list is invalid
     */
    @PutMapping("/{id}")
    public ResponseEntity<DeckResponseDto> update(@PathVariable Long id,
                                                  @Valid @RequestBody DeckSaveRequestDto deckDto,
                                                  @AuthenticationPrincipal User user) {
        deckSaveRateLimiter.checkLimit("user:" + user.getId());
        return ResponseEntity.ok(deckService.updateDeck(id, deckDto, user));
    }

    /**
     * Deletes an existing deck owned by the currently authenticated user.
     *
     * @param id   the ID of the deck to delete
     * @param user the authenticated user requesting deletion
     * @return 24 No Content on success, or 404 Not Found if the deck doesn't exist
     * @throws NoSuchElementException if the deck is not found or user is unauthorized
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        deckService.deleteDeck(id, user);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves all distinct supported deck formats (e.g. TCG, OCG, GOAT, EDISON).
     *
     * @return a list of format name strings
     */
    @GetMapping("/formats")
    public ResponseEntity<List<String>> getFormats() {
        return ResponseEntity.ok(deckService.findDistinctFormats());
    }

    /**
     * Imports a .ydk file or string content into a resolved deck DTO structure.
     *
     * @param file    optional uploaded .ydk file
     * @param rawBody optional raw .ydk text payload
     * @return 200 OK with YdkImportResponseDto containing deck details and warnings
     */
    @PostMapping("/import/ydk")
    public ResponseEntity<YdkImportResponseDto>
            importYdk(@RequestParam(value = "file", required = false) MultipartFile file,
                      @RequestBody(required = false) String rawBody) {
        String content = "";
        if (file != null && !file.isEmpty()) {
            try {
                content = new String(file.getBytes(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                throw new YdkImportException("Failed to read uploaded .ydk file", e);
            }
        } else if (rawBody != null) {
            content = rawBody;
        }

        return ResponseEntity.ok(ydkService.importYdk(content));
    }

    /**
     * Exports a deck to standard .ydk text file format.
     *
     * @param id the ID of the deck to export
     * @return 200 OK with text/plain .ydk content and attachment disposition header
     */
    @GetMapping("/{id}/export/ydk")
    public ResponseEntity<String> exportYdk(@PathVariable Long id) {
        String ydkContent = ydkService.exportYdk(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
                new MediaType("text", "plain", StandardCharsets.UTF_8));
        headers.setContentDispositionFormData("attachment", "deck_" + id + ".ydk");

        return ResponseEntity.ok().headers(headers).body(ydkContent);
    }
}
