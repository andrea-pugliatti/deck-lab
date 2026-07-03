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
    void testGenerateDeck() {
        // Arrange
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", "Milling", "Edison", "None");
        Prompt mockPrompt = new Prompt("test");
        when(promptBuilder.buildGenerationPrompt(eq(request), any())).thenReturn(mockPrompt);

        String rawResponse = "raw response";
        when(aiClient.call(mockPrompt)).thenReturn(rawResponse);

        DeckGenerateAiResponseDto parsed = new DeckGenerateAiResponseDto("AI Lightsworn", "Fast deck", List.of());
        when(responseParser.parseGenerationResponse(rawResponse)).thenReturn(parsed);

        List<CardResolver.ResolvedCardEntry> resolved = List.of();
        when(cardResolver.resolveCards(parsed.getCards())).thenReturn(resolved);

        Deck deck = new Deck();
        deck.setName("AI Lightsworn");
        deck.setDescription("Fast deck");
        when(deckAssembler.assembleDeck("AI Lightsworn", "Edison", resolved)).thenReturn(deck);

        List<DeckCardDto> cardDtos = List.of(
                new DeckCardDto(1L, 15L, "Judgment Dragon", "Effect Monster", "Desc", "Dragon", "Light", "None", "url",
                        "MAIN", 2));
        when(deckAssembler.toDeckCardDtos(resolved)).thenReturn(cardDtos);

        List<String> warnings = List.of("Warning 1");
        when(validationAdapter.validate(deck)).thenReturn(warnings);

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn", responseDto.getName());
        assertEquals("Fast deck", responseDto.getDescription());
        assertEquals(1, responseDto.getDeckCards().size());
        assertEquals("Judgment Dragon", responseDto.getDeckCards().get(0).getName());
        assertEquals(2, responseDto.getDeckCards().get(0).getQuantity());
        assertEquals(1, responseDto.getValidationWarnings().size());
        assertEquals("Warning 1", responseDto.getValidationWarnings().get(0));

        verify(promptBuilder).buildGenerationPrompt(eq(request), any());
        verify(aiClient).call(mockPrompt);
        verify(responseParser).parseGenerationResponse(rawResponse);
        verify(cardResolver).resolveCards(parsed.getCards());
        verify(deckAssembler).assembleDeck("AI Lightsworn", "Edison", resolved);
        verify(deckAssembler).toDeckCardDtos(resolved);
        verify(validationAdapter).validate(deck);
    }
}
