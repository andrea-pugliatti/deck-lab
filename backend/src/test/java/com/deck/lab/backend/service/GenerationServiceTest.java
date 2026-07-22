package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.prompt.Prompt;

import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionListResponseDto;
import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.Strategy;
import com.deck.lab.backend.service.generation.AiClient;
import com.deck.lab.backend.service.generation.CardResolver;
import com.deck.lab.backend.service.generation.DeckAssembler;
import com.deck.lab.backend.service.generation.PromptBuilder;
import com.deck.lab.backend.service.generation.ResponseParser;
import com.deck.lab.backend.service.generation.ValidationAdapter;
import com.deck.lab.backend.service.generation.model.DeckGenerateAiResponse;
import com.deck.lab.backend.service.generation.model.ResolvedCardEntry;

@ExtendWith(MockitoExtension.class)
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
        deckGenerationService = new GenerationService(
                promptBuilder,
                aiClient,
                responseParser,
                cardResolver,
                deckAssembler,
                validationAdapter);
    }

    @Test
    void testSuggestCards() {
        // Arrange
        DeckSuggestRequestDto request = new DeckSuggestRequestDto(Format.EDISON, List.of());
        Prompt mockPrompt = new Prompt("test");
        when(promptBuilder.buildSuggestionPrompt(eq(request), any())).thenReturn(mockPrompt);

        String rawResponse = "raw response";
        when(aiClient.call(mockPrompt)).thenReturn(rawResponse);

        CardSuggestionListResponseDto parsed = new CardSuggestionListResponseDto();
        CardSuggestionResponseDto suggestion = new CardSuggestionResponseDto("Lumina",
                DeckSection.MAIN,
                "Milling", 10L,
                CardType.EFFECT_MONSTER, "url");
        parsed.setSuggestions(List.of(suggestion));
        when(responseParser.parseSuggestionResponse(rawResponse)).thenReturn(parsed);

        List<CardSuggestionResponseDto> expectedSuggestions = List.of(suggestion);
        when(cardResolver.resolveSuggestions(parsed.getSuggestions()))
                .thenReturn(expectedSuggestions);

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
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", Strategy.NONE,
                Format.EDISON, "None");
        Prompt mockDraftPrompt = new Prompt("draft");
        when(promptBuilder.buildDraftPrompt(eq(request), any())).thenReturn(mockDraftPrompt);

        String rawResponse = "raw response";
        when(aiClient.call(mockDraftPrompt)).thenReturn(rawResponse);

        DeckGenerateAiResponse parsed = new DeckGenerateAiResponse("AI Lightsworn", "Fast deck",
                List.of());
        when(responseParser.parseGenerationResponse(rawResponse)).thenReturn(parsed);

        List<ResolvedCardEntry> resolved = List.of();
        when(cardResolver.resolveCards(parsed.getCards())).thenReturn(resolved);

        Deck deck = new Deck();
        deck.setName("AI Lightsworn");
        deck.setDescription("Fast deck");
        when(deckAssembler.assembleDeck("AI Lightsworn", Format.EDISON, resolved)).thenReturn(deck);

        List<DeckCardResponseDto> cardDtos = List.of(
                new DeckCardResponseDto(1L, 15L, "Judgment Dragon", CardType.EFFECT_MONSTER, "Desc",
                        CardRace.DRAGON,
                        CardAttribute.LIGHT,
                        "None", "url",
                        DeckSection.MAIN, 2));
        when(deckAssembler.toDeckCardDtos(resolved)).thenReturn(cardDtos);

        List<String> warnings = List.of(); // Fast path: no warnings
        when(validationAdapter.validate(any())).thenReturn(warnings);

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn", responseDto.getName());
        assertEquals("Fast deck", responseDto.getDescription());
        assertEquals(Format.EDISON, responseDto.getFormatName());
        assertEquals(cardDtos, responseDto.getDeckCards());
        assertEquals(0, responseDto.getValidationWarnings().size());

        verify(promptBuilder).buildDraftPrompt(eq(request), any());
        verify(aiClient).call(mockDraftPrompt);
        verify(responseParser).parseGenerationResponse(rawResponse);
        verify(cardResolver).resolveCards(parsed.getCards());
        verify(deckAssembler).assembleDeck("AI Lightsworn", Format.EDISON, resolved);
        verify(validationAdapter).validate(deck);
        verify(deckAssembler).toDeckCardDtos(resolved);
    }

    @Test
    void testGenerateDeck_RefinementLoopSuccess() {
        // Arrange
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", Strategy.NONE,
                Format.EDISON, "None");
        Prompt mockDraftPrompt = new Prompt("draft");
        when(promptBuilder.buildDraftPrompt(eq(request), any())).thenReturn(mockDraftPrompt);

        String draftRawResponse = "draft raw response";
        when(aiClient.call(mockDraftPrompt)).thenReturn(draftRawResponse);

        DeckGenerateAiResponse draftParsed = new DeckGenerateAiResponse("AI Lightsworn Draft",
                "Draft deck", List.of());
        when(responseParser.parseGenerationResponse(draftRawResponse)).thenReturn(draftParsed);

        // Mock resolver: draft returns 1 unresolved name
        com.deck.lab.backend.service.generation.model.CardEntry unresolvedEntry = new com.deck.lab.backend.service.generation.model.CardEntry(
                "UnresolvedCard", DeckSection.MAIN, 1);
        DeckGenerateAiResponse draftWithCards = new DeckGenerateAiResponse("AI Lightsworn Draft",
                "Draft deck", List.of(unresolvedEntry));
        when(responseParser.parseGenerationResponse(draftRawResponse)).thenReturn(draftWithCards);
        when(cardResolver.lookupCard("UnresolvedCard")).thenReturn(java.util.Optional.empty());

        List<ResolvedCardEntry> draftResolved = List.of();
        when(cardResolver.resolveCards(draftWithCards.getCards())).thenReturn(draftResolved);

        // Warnings for draft
        Deck draftDeck = new Deck();
        draftDeck.setName("AI Lightsworn Draft");
        when(deckAssembler.assembleDeck("AI Lightsworn Draft", Format.EDISON, draftResolved))
                .thenReturn(draftDeck);
        when(validationAdapter.validate(draftDeck))
                .thenReturn(List.of("Warning: Main deck has less than 40 cards"));

        // Refinement step setup
        Prompt mockRefinedPrompt = new Prompt("refined");
        when(promptBuilder.buildRefinementPrompt(eq(request),
                eq(draftResolved),
                eq(List.of("UnresolvedCard")),
                eq(List.of("Warning: Main deck has less than 40 cards")),
                any())).thenReturn(mockRefinedPrompt);

        String refinedRawResponse = "refined raw response";
        when(aiClient.call(mockRefinedPrompt)).thenReturn(refinedRawResponse);

        DeckGenerateAiResponse refinedParsed = new DeckGenerateAiResponse("AI Lightsworn Final",
                "Final deck", List.of());
        when(responseParser.parseGenerationResponse(refinedRawResponse)).thenReturn(refinedParsed);

        // Mock resolver: refined returns valid card
        com.deck.lab.backend.model.Card luminaCard = new com.deck.lab.backend.model.Card();
        luminaCard.setName("Lumina");

        List<ResolvedCardEntry> finalResolved = List
                .of(new ResolvedCardEntry(luminaCard, DeckSection.MAIN, 3));
        when(cardResolver.resolveCards(refinedParsed.getCards())).thenReturn(finalResolved);

        // Warnings for refined: empty
        Deck finalDeck = new Deck();
        finalDeck.setName("AI Lightsworn Final");
        when(deckAssembler
                .assembleDeck(eq("AI Lightsworn Final"), eq(Format.EDISON), eq(finalResolved)))
                        .thenReturn(finalDeck);
        when(validationAdapter.validate(finalDeck)).thenReturn(List.of());

        // Card DTO representation
        List<DeckCardResponseDto> cardDtos = List.of(
                new DeckCardResponseDto(1L, 15L, "Lumina", CardType.EFFECT_MONSTER, "Desc",
                        CardRace.SPELLCASTER,
                        CardAttribute.LIGHT,
                        "None", "url",
                        DeckSection.MAIN, 3));
        when(deckAssembler.toDeckCardDtos(finalResolved)).thenReturn(cardDtos);

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn Final", responseDto.getName());
        assertEquals("Final deck", responseDto.getDescription());
        assertEquals(Format.EDISON, responseDto.getFormatName());
        assertEquals(cardDtos, responseDto.getDeckCards());
        assertEquals(0, responseDto.getValidationWarnings().size());

        verify(promptBuilder).buildRefinementPrompt(eq(request),
                eq(draftResolved),
                eq(List.of("UnresolvedCard")),
                eq(List.of("Warning: Main deck has less than 40 cards")),
                any());
        verify(aiClient).call(mockRefinedPrompt);
    }
}
