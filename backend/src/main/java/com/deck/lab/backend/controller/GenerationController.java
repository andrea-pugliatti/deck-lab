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
import com.deck.lab.backend.service.GenerationService;

import jakarta.validation.Valid;

/**
 * REST Controller providing API endpoints for AI-driven deck list generation
 * and card synergy recommendations.
 *
 * <p>
 * <strong>Controller (REST API)</strong>
 * </p>
 * <p>
 * This controller orchestrates user requests to build or analyze decks using
 * Large Language Models (LLMs). It acts as an integration gateway: accepting
 * strategy requests, prompting the AI engine via {@link GenerationService},
 * resolving the resulting text suggestions against our relational database,
 * passing them through our local validation engine, and returning complete card
 * payloads alongside warning arrays explaining any rules adjustments.
 * </p>
 */
@RestController
@RequestMapping("/api/decks/ai")
public class GenerationController {

    private final GenerationService deckGenerationService;

    public GenerationController(GenerationService deckGenerationService) {
        this.deckGenerationService = deckGenerationService;
    }

    /**
     * Generates a fully compiled deck list based on format, archetype, strategy,
     * and optional user instructions. Validates generated cards against rules.
     *
     * @param request DTO containing formatName, archetype, strategy, and custom
     *                prompts
     * @return 200 OK with the generated deck list and any compliance warnings
     */
    @PostMapping("/generate")
    public ResponseEntity<DeckGenerationResponseDto> generate(@Valid @RequestBody DeckGenerateRequestDto request) {
        return ResponseEntity.ok(deckGenerationService.generateDeck(request));
    }

    /**
     * Recommends exactly 5 card suggestions that synergize with the current
     * partially built deck list.
     *
     * @param request DTO containing formatName and the current list of card
     *                quantities
     * @return 200 OK with a list of 5 card suggestions and synergy rationales
     */
    @PostMapping("/suggest")
    public ResponseEntity<List<CardSuggestionDto>> suggest(@Valid @RequestBody DeckSuggestRequestDto request) {
        return ResponseEntity.ok(deckGenerationService.suggestCards(request));
    }
}
