package com.deck.lab.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.service.DeckService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public ResponseEntity<List<DeckDto>> index(
            @RequestParam(value = "q", required = false) String name,
            @RequestParam(value = "format", required = false) String format,
            @RequestParam(value = "username", required = false) String username) {
        return ResponseEntity.ok(deckService.findAllWithFilters(name, format, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckDto> show(@PathVariable Long id) {
        if (!deckService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    @PostMapping
    public ResponseEntity<DeckDto> create(
            @Valid @RequestBody DeckDto deckDto,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.status(HttpStatus.CREATED).body(deckService.createDeck(deckDto, user));
    }

    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@Valid @RequestBody DeckDto deckDto) {
        deckService.validateDeck(deckDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeckDto> update(
            @PathVariable Long id,
            @Valid @RequestBody DeckDto deckDto,
            @AuthenticationPrincipal User user) {
        if (!deckService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deckService.updateDeck(id, deckDto, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (!deckService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deckService.deleteDeck(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formats")
    public ResponseEntity<List<String>> getFormats() {
        return ResponseEntity.ok(deckService.findDistinctFormats());
    }
}
