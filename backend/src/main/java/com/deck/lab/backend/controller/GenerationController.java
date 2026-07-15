package com.deck.lab.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.service.GenerationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * REST Controller providing API endpoints for AI-driven deck list generation and card synergy
 * recommendations.
 *
 * <p>
 * <strong>Controller (REST API)</strong>
 * </p>
 * <p>
 * This controller orchestrates user requests to build or analyze decks using Large Language Models
 * (LLMs). It acts as an integration gateway: accepting strategy requests, prompting the AI engine
 * via {@link GenerationService}, resolving the resulting text suggestions against our relational
 * database, passing them through our local validation engine, and returning complete card payloads
 * alongside warning arrays explaining any rules adjustments.
 * </p>
 *
 * <p>
 * <strong>Client-Level Rate Limiting</strong>
 * </p>
 * <p>
 * To protect AI endpoints from excessive resource consumption, this controller delegates
 * rate-limiting validation to the {@code @Qualifier("aiGenerationRateLimiter")} {@link RateLimiter}
 * implementation, tracking attempts per client IP address.
 * </p>
 */
@RestController
@RequestMapping("/api/decks/ai")
public class GenerationController {

    private final GenerationService deckGenerationService;
    private final RateLimiter rateLimiter;

    public GenerationController(GenerationService deckGenerationService,
                                @Qualifier("aiGenerationRateLimiter") RateLimiter rateLimiter) {
        this.deckGenerationService = deckGenerationService;
        this.rateLimiter = rateLimiter;
    }

    /**
     * Generates a fully compiled deck list based on format, archetype, strategy, and optional user
     * instructions. Validates generated cards against rules.
     *
     * @param request DTO containing formatName, archetype, strategy, and custom prompts
     * @return 200 OK with the generated deck list and any compliance warnings
     */
    @PostMapping("/generate")
    public ResponseEntity<DeckGenerationResponseDto>
            generate(@Valid @RequestBody DeckGenerateRequestDto request,
                     HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        rateLimiter.checkLimit(ipAddress);
        return ResponseEntity.ok(deckGenerationService.generateDeck(request));
    }

    /**
     * Recommends exactly 5 card suggestions that synergize with the current partially built deck
     * list.
     *
     * @param request DTO containing formatName and the current list of card quantities
     * @return 200 OK with a list of 5 card suggestions and synergy rationales
     */
    @PostMapping("/suggest")
    public ResponseEntity<List<CardSuggestionResponseDto>>
            suggest(@Valid @RequestBody DeckSuggestRequestDto request,
                    HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        rateLimiter.checkLimit(ipAddress);
        return ResponseEntity.ok(deckGenerationService.suggestCards(request));
    }
}
