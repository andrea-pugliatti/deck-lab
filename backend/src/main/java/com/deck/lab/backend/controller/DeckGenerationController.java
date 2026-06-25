package com.deck.lab.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.service.DeckGenerationService;

import jakarta.validation.Valid;

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
