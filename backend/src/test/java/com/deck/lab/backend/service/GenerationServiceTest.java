package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ai.chat.prompt.Prompt;

import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.dto.response.CardSuggestionsAiResponseDto;
import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.dto.response.DeckGenerateAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.service.generation.AiClient;
import com.deck.lab.backend.service.generation.CardResolver;
import com.deck.lab.backend.service.generation.ResolvedCardEntry;
import com.deck.lab.backend.service.generation.DeckAssembler;
import com.deck.lab.backend.service.generation.PromptBuilder;
import com.deck.lab.backend.service.generation.ResponseParser;
import com.deck.lab.backend.service.generation.ValidationAdapter;

class GenerationServiceTest {

    @Mock
    private PromptBuilder promptBuilder;

    @Mock
    private AiClient aiClient;

    @Mock
    private ResponseParser responseParser;

    @Mock
    private CardResolver cardResolver;

    @Mock
    private DeckAssembler deckAssembler;

    @Mock
    private ValidationAdapter validationAdapter;

    private GenerationService deckGenerationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        deckGenerationService = new GenerationService(
                promptBuilder, aiClient, responseParser, cardResolver, deckAssembler, validationAdapter);
    }

    @Test
    void testSuggestCards() {
        // Arrange
        DeckSuggestRequestDto request = new DeckSuggestRequestDto("Edison", new ArrayList<>());
        Prompt mockPrompt = new Prompt("test");
        when(promptBuilder.buildSuggestionPrompt(eq(request), any())).thenReturn(mockPrompt);

        String rawResponse = "raw response";
        when(aiClient.call(mockPrompt)).thenReturn(rawResponse);

        CardSuggestionsAiResponseDto parsed = new CardSuggestionsAiResponseDto();
        CardSuggestionResponseDto suggestion = new CardSuggestionResponseDto("Lumina", "MAIN", "Milling", 10L,
                "Effect Monster", "url");
        parsed.setSuggestions(List.of(suggestion));
        when(responseParser.parseSuggestionResponse(rawResponse)).thenReturn(parsed);

        List<CardSuggestionResponseDto> expectedSuggestions = List.of(suggestion);
        when(cardResolver.resolveSuggestions(parsed.getSuggestions())).thenReturn(expectedSuggestions);

        // Act
        List<CardSuggestionResponseDto> suggestions = deckGenerationService.suggestCards(request);

        // Assert
        assertNotNull(suggestions);
        assertEquals(1, suggestions.size());
        assertEquals("Lumina", suggestions.get(0).getName());
        verify(promptBuilder).buildSuggestionPrompt(eq(request), any());
        verify(aiClient).call(mockPrompt);
        verify(responseParser).parseSuggestionResponse(rawResponse);
        verify(cardResolver).resolveSuggestions(parsed.getSuggestions());
    }

    @Test
    void testGenerateDeck_FastPath() {
        // Arrange
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", "Milling", "Edison", "None");
        Prompt mockDraftPrompt = new Prompt("draft");
        when(promptBuilder.buildDraftPrompt(eq(request), any())).thenReturn(mockDraftPrompt);

        String rawResponse = "raw response";
        when(aiClient.call(mockDraftPrompt)).thenReturn(rawResponse);

        DeckGenerateAiResponseDto parsed = new DeckGenerateAiResponseDto("AI Lightsworn", "Fast deck", List.of());
        when(responseParser.parseGenerationResponse(rawResponse)).thenReturn(parsed);

        List<ResolvedCardEntry> resolved = List.of();
        when(cardResolver.resolveCards(parsed.getCards())).thenReturn(resolved);

        Deck deck = new Deck();
        deck.setName("AI Lightsworn");
        deck.setDescription("Fast deck");
        when(deckAssembler.assembleDeck("AI Lightsworn", "Edison", resolved)).thenReturn(deck);

        List<DeckCardDto> cardDtos = List.of(
                new DeckCardDto(1L, 15L, "Judgment Dragon", "Effect Monster", "Desc", "Dragon", "Light", "None", "url",
                        "MAIN", 2));
        when(deckAssembler.toDeckCardDtos(resolved)).thenReturn(cardDtos);

        List<String> warnings = List.of(); // Fast path: no warnings
        when(validationAdapter.validate(any())).thenReturn(warnings);

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn", responseDto.getName());
        assertEquals("Fast deck", responseDto.getDescription());
        assertEquals(1, responseDto.getDeckCards().size());
        assertEquals("Judgment Dragon", responseDto.getDeckCards().get(0).getName());
        assertEquals(0, responseDto.getValidationWarnings().size());

        verify(promptBuilder).buildDraftPrompt(eq(request), any());
        verify(aiClient).call(mockDraftPrompt);
        verify(responseParser).parseGenerationResponse(rawResponse);
        verify(cardResolver).resolveCards(parsed.getCards());
        verify(deckAssembler).assembleDeck("AI Lightsworn", "Edison", resolved);
        verify(deckAssembler).toDeckCardDtos(resolved);
        verify(validationAdapter).validate(any());
    }

    @Test
    void testGenerateDeck_WithRefinement() {
        // Arrange
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", "Milling", "Edison", "None");
        Prompt mockDraftPrompt = new Prompt("draft");
        when(promptBuilder.buildDraftPrompt(eq(request), any())).thenReturn(mockDraftPrompt);

        String rawDraftResponse = "raw draft response";
        when(aiClient.call(mockDraftPrompt)).thenReturn(rawDraftResponse);

        // Draft response contains 1 unresolved card: "UnresolvedCard"
        com.deck.lab.backend.dto.CardEntryDto draftEntry = new com.deck.lab.backend.dto.CardEntryDto("UnresolvedCard", "MAIN", 3);
        DeckGenerateAiResponseDto draftParsed = new DeckGenerateAiResponseDto("AI Lightsworn Draft", "Draft deck", List.of(draftEntry));
        when(responseParser.parseGenerationResponse(rawDraftResponse)).thenReturn(draftParsed);

        // Mock resolver: draft lookupCard returns empty (unresolved)
        when(cardResolver.lookupCard("UnresolvedCard")).thenReturn(java.util.Optional.empty());
        List<ResolvedCardEntry> draftResolved = List.of();
        when(cardResolver.resolveCards(draftParsed.getCards())).thenReturn(draftResolved);

        // Warnings for the draft
        List<String> draftWarnings = List.of("Warning 1");
        // We mock the first validate call to return warnings
        Deck draftDeck = new Deck();
        draftDeck.setName("AI Lightsworn Draft");
        when(deckAssembler.assembleDeck(eq("AI Lightsworn Draft"), eq("Edison"), eq(draftResolved))).thenReturn(draftDeck);
        when(validationAdapter.validate(draftDeck)).thenReturn(draftWarnings);

        // Step 2: Refinement Call
        Prompt mockRefinementPrompt = new Prompt("refinement");
        when(promptBuilder.buildRefinementPrompt(eq(request), eq(draftResolved), eq(List.of("UnresolvedCard")), eq(draftWarnings), any()))
                .thenReturn(mockRefinementPrompt);

        String rawRefinementResponse = "raw refinement response";
        when(aiClient.call(mockRefinementPrompt)).thenReturn(rawRefinementResponse);

        // Refined response has a resolved card
        com.deck.lab.backend.dto.CardEntryDto refinedEntry = new com.deck.lab.backend.dto.CardEntryDto("Lumina", "MAIN", 3);
        DeckGenerateAiResponseDto refinedParsed = new DeckGenerateAiResponseDto("AI Lightsworn Final", "Final deck", List.of(refinedEntry));
        when(responseParser.parseGenerationResponse(rawRefinementResponse)).thenReturn(refinedParsed);

        // Mock resolver: refined lookupCard returns valid card
        com.deck.lab.backend.model.Card luminaCard = new com.deck.lab.backend.model.Card();
        luminaCard.setName("Lumina");
        when(cardResolver.lookupCard("Lumina")).thenReturn(java.util.Optional.of(luminaCard));

        List<ResolvedCardEntry> finalResolved = List.of(new ResolvedCardEntry(luminaCard, "MAIN", 3));
        when(cardResolver.resolveCards(refinedParsed.getCards())).thenReturn(finalResolved);

        // Warnings for refined: empty
        Deck finalDeck = new Deck();
        finalDeck.setName("AI Lightsworn Final");
        when(deckAssembler.assembleDeck(eq("AI Lightsworn Final"), eq("Edison"), eq(finalResolved))).thenReturn(finalDeck);
        when(validationAdapter.validate(finalDeck)).thenReturn(List.of());

        // Card DTO representation
        List<DeckCardDto> cardDtos = List.of(
                new DeckCardDto(1L, 15L, "Lumina", "Effect Monster", "Desc", "Spellcaster", "Light", "None", "url",
                        "MAIN", 3));
        when(deckAssembler.toDeckCardDtos(finalResolved)).thenReturn(cardDtos);

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn Final", responseDto.getName());
        assertEquals("Final deck", responseDto.getDescription());
        assertEquals(1, responseDto.getDeckCards().size());
        assertEquals("Lumina", responseDto.getDeckCards().get(0).getName());
        assertEquals(0, responseDto.getValidationWarnings().size());

        verify(promptBuilder).buildDraftPrompt(eq(request), any());
        verify(promptBuilder).buildRefinementPrompt(eq(request), eq(draftResolved), eq(List.of("UnresolvedCard")), eq(draftWarnings), any());
        verify(aiClient).call(mockDraftPrompt);
        verify(aiClient).call(mockRefinementPrompt);
        verify(responseParser).parseGenerationResponse(rawDraftResponse);
        verify(responseParser).parseGenerationResponse(rawRefinementResponse);
        verify(cardResolver).resolveCards(draftParsed.getCards());
        verify(cardResolver).resolveCards(refinedParsed.getCards());
        verify(deckAssembler).toDeckCardDtos(finalResolved);
    }
}
