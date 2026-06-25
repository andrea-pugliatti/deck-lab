package com.deck.lab.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.service.DeckGenerationService;

import java.util.List;

@RestController
@RequestMapping("/api/decks/ai")
public class DeckGenerationController {

    private final DeckGenerationService deckGenerationService;

    public DeckGenerationController(DeckGenerationService deckGenerationService) {
        this.deckGenerationService = deckGenerationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<DeckGenerationResponseDto> generate(@Valid @RequestBody DeckGenerateRequestDto request) {
        return ResponseEntity.ok(deckGenerationService.generateDeck(request));
    }

    @PostMapping("/suggest")
    public ResponseEntity<List<CardSuggestionDto>> suggest(@Valid @RequestBody DeckSuggestRequestDto request) {
        return ResponseEntity.ok(deckGenerationService.suggestCards(request));
    }
}
