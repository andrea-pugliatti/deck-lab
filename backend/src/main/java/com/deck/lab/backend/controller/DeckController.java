package com.deck.lab.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.service.DeckService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public ResponseEntity<List<DeckDto>> index(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(deckService.getDecksByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckDto> show(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(deckService.getDeckById(id, user));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<DeckDto> create(@Valid @RequestBody DeckDto deckDto, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deckService.createDeck(deckDto, user));
    }

    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@Valid @RequestBody DeckDto deckDto) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeckDto> update(@PathVariable Long id, @Valid @RequestBody DeckDto deckDto,
            @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(deckService.updateDeck(id, deckDto, user));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            deckService.deleteDeck(id, user);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
