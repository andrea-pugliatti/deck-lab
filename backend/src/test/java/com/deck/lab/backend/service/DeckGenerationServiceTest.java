package com.deck.lab.backend.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.prompt.Prompt;

import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.DeckGenerationResponseDto;
import com.deck.lab.backend.model.*;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

import com.deck.lab.backend.validation.DeckValidationEngine;

import java.util.*;

class DeckGenerationServiceTest {

    @Mock
    private ChatModel chatModel;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private FormatRulesRepository formatRulesRepository;

    private DeckGenerationService deckGenerationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        deckGenerationService = new DeckGenerationService(chatModel, cardRepository, formatRulesRepository, new DeckValidationEngine());
    }

    @Test
    void testSuggestCards() {
        // Arrange
        DeckSuggestRequestDto request = new DeckSuggestRequestDto("Edison", new ArrayList<>());
        ChatResponse mockResponse = mock(ChatResponse.class);
        Generation mockGeneration = mock(Generation.class);
        AssistantMessage mockAssistantMessage = mock(AssistantMessage.class);

        when(chatModel.call(any(Prompt.class))).thenReturn(mockResponse);
        when(mockResponse.getResult()).thenReturn(mockGeneration);
        when(mockGeneration.getOutput()).thenReturn(mockAssistantMessage);

        // Mock a structured output response
        String jsonResponse = "{\"suggestions\": [{\"name\": \"Lumina, Lightsworn Summoner\", \"section\": \"MAIN\", \"synergyReason\": \"Enables milling.\"}]}";
        when(mockAssistantMessage.getText()).thenReturn(jsonResponse);

        Card mockCard = new Card();
        mockCard.setId(10L);
        mockCard.setName("Lumina, Lightsworn Summoner");
        when(cardRepository.findByName(eq("Lumina, Lightsworn Summoner"))).thenReturn(Optional.of(mockCard));

        // Act
        List<CardSuggestionDto> suggestions = deckGenerationService.suggestCards(request);

        // Assert
        assertNotNull(suggestions);
        assertEquals(1, suggestions.size());
        assertEquals("Lumina, Lightsworn Summoner", suggestions.get(0).getName());
        verify(cardRepository).findByName("Lumina, Lightsworn Summoner");
    }

    @Test
    void testGenerateDeck() {
        // Arrange
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", "Milling", "Edison", "None");
        ChatResponse mockResponse = mock(ChatResponse.class);
        Generation mockGeneration = mock(Generation.class);
        AssistantMessage mockAssistantMessage = mock(AssistantMessage.class);

        when(chatModel.call(any(Prompt.class))).thenReturn(mockResponse);
        when(mockResponse.getResult()).thenReturn(mockGeneration);
        when(mockGeneration.getOutput()).thenReturn(mockAssistantMessage);

        String jsonResponse = "{\"name\": \"AI Lightsworn\", \"description\": \"Fast deck\", \"cards\": [{\"name\": \"Judgment Dragon\", \"section\": \"MAIN\", \"quantity\": 2}]}";
        when(mockAssistantMessage.getText()).thenReturn(jsonResponse);

        Card jdCard = new Card();
        jdCard.setId(15L);
        jdCard.setName("Judgment Dragon");
        when(cardRepository.findByName(eq("Judgment Dragon"))).thenReturn(Optional.of(jdCard));
        when(cardRepository.findAllById(anyList())).thenReturn(Collections.singletonList(jdCard));
        when(formatRulesRepository.findByFormatName(eq("Edison"))).thenReturn(new ArrayList<>());

        // Act
        DeckGenerationResponseDto responseDto = deckGenerationService.generateDeck(request);

        // Assert
        assertNotNull(responseDto);
        assertEquals("AI Lightsworn", responseDto.getName());
        assertEquals(1, responseDto.getDeckCards().size());
        assertEquals("Judgment Dragon", responseDto.getDeckCards().get(0).getName());
        assertEquals(2, responseDto.getDeckCards().get(0).getQuantity());
    }
}
