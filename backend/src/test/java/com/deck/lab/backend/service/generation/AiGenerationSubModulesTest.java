package com.deck.lab.backend.service.generation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.dto.CardEntryDto;
import com.deck.lab.backend.dto.CardSuggestionDto;
import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionsAiResponseDto;
import com.deck.lab.backend.dto.response.DeckGenerateAiResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.validation.DeckValidationEngine;

class AiGenerationSubModulesTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private FormatRulesRepository formatRulesRepository;

    private PromptBuilder promptBuilder;
    private ResponseParser responseParser;
    private CardResolver cardResolver;
    private DeckAssembler deckAssembler;
    private ValidationAdapter validationAdapter;
    private CardSearchTool cardSearchTool;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        promptBuilder = new PromptBuilder();
        responseParser = new ResponseParser();
        cardResolver = new CardResolver(cardRepository);
        deckAssembler = new DeckAssembler();
        validationAdapter = new ValidationAdapter(formatRulesRepository, new DeckValidationEngine());
        cardSearchTool = new CardSearchTool(cardRepository);
    }

    @Test
    void testPromptBuilderGeneration() {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", "Milling", "Edison", "Include JD");
        Prompt prompt = promptBuilder.buildGenerationPrompt(request, "formatInstructionsTemplate");

        assertNotNull(prompt);
        String systemContent = prompt.getInstructions().get(0).getText();
        String userContent = prompt.getInstructions().get(1).getText();

        assertTrue(systemContent.contains("Lightsworn"));
        assertTrue(systemContent.contains("Milling"));
        assertTrue(systemContent.contains("Include JD"));
        assertTrue(systemContent.contains("formatInstructionsTemplate"));
        assertTrue(userContent.contains("Edison"));
    }

    @Test
    void testPromptBuilderSuggestions() {
        DeckSuggestRequestDto request = new DeckSuggestRequestDto("Edison", List.of());
        Prompt prompt = promptBuilder.buildSuggestionPrompt(request, "formatInstructionsTemplate");

        assertNotNull(prompt);
        String systemContent = prompt.getInstructions().get(0).getText();
        assertTrue(systemContent.contains("Edison"));
        assertTrue(systemContent.contains("(Empty Deck)"));
    }

    @Test
    void testResponseParser() {
        String rawGenResponse = "{\"name\": \"Lightsworn Mill\", \"description\": \"Fast milling deck\", \"cards\": [{\"name\": \"Judgment Dragon\", \"section\": \"MAIN\", \"quantity\": 3}]}";
        DeckGenerateAiResponseDto genResponse = responseParser.parseGenerationResponse(rawGenResponse);

        assertNotNull(genResponse);
        assertEquals("Lightsworn Mill", genResponse.getName());
        assertEquals(1, genResponse.getCards().size());
        assertEquals("Judgment Dragon", genResponse.getCards().get(0).getName());

        String rawSuggestResponse = "{\"suggestions\": [{\"name\": \"Solar Recharge\", \"section\": \"MAIN\", \"synergyReason\": \"Draw and mill.\"}]}";
        CardSuggestionsAiResponseDto suggestResponse = responseParser.parseSuggestionResponse(rawSuggestResponse);

        assertNotNull(suggestResponse);
        assertEquals(1, suggestResponse.getSuggestions().size());
        assertEquals("Solar Recharge", suggestResponse.getSuggestions().get(0).getName());
    }

    @Test
    void testCardResolver() {
        Card jdCard = new Card();
        jdCard.setId(1L);
        jdCard.setName("Judgment Dragon");
        jdCard.setType(CardType.EFFECT_MONSTER);

        when(cardRepository.findByName("Judgment Dragon")).thenReturn(Optional.of(jdCard));

        List<CardEntryDto> rawEntries = List.of(
                new CardEntryDto("Judgment Dragon", "MAIN", 3),
                new CardEntryDto("Unknown Card", "EXTRA", 1));

        List<CardResolver.ResolvedCardEntry> resolved = cardResolver.resolveCards(rawEntries);

        assertEquals(1, resolved.size());
        assertEquals(jdCard, resolved.get(0).card());
        assertEquals("MAIN", resolved.get(0).section());
        assertEquals(3, resolved.get(0).quantity());
    }

    @Test
    void testCardResolverFallbackSearch() {
        Card lumina = new Card();
        lumina.setId(2L);
        lumina.setName("Lumina, Lightsworn Summoner");

        when(cardRepository.findByName("Lumina")).thenReturn(Optional.empty());
        when(cardRepository.findByNameContainingIgnoreCase("Lumina")).thenReturn(List.of(lumina));

        Optional<Card> resolved = cardResolver.lookupCard("Lumina");

        assertTrue(resolved.isPresent());
        assertEquals("Lumina, Lightsworn Summoner", resolved.get().getName());
    }

    @Test
    void testCardSearchTool() {
        Card card = new Card();
        card.setId(3L);
        card.setName("Honest");
        card.setType(CardType.EFFECT_MONSTER);
        card.setArchetype("None");

        when(cardRepository.findByNameContainingIgnoreCase("Honest")).thenReturn(List.of(card));

        CardSearchTool.CardSearchResponse response = cardSearchTool
                .apply(new CardSearchTool.CardSearchRequest("Honest"));

        assertNotNull(response);
        assertEquals(1, response.results().size());
        assertEquals("Honest", response.results().get(0).name());
    }

    @Test
    void testDeckAssembler() {
        Card card = new Card();
        card.setId(5L);
        card.setName("Judgment Dragon");
        card.setType(CardType.EFFECT_MONSTER);

        List<CardResolver.ResolvedCardEntry> resolved = List.of(
                new CardResolver.ResolvedCardEntry(card, "MAIN", 3));

        Deck deck = deckAssembler.assembleDeck("AI Deck", "Edison", resolved);

        assertEquals("AI Deck", deck.getName());
        assertEquals(Format.EDISON, deck.getFormatName());
        assertEquals(1, deck.getDeckCards().size());
        assertEquals(card, deck.getDeckCards().get(0).getCard());
        assertEquals(DeckSection.MAIN, deck.getDeckCards().get(0).getSection());
        assertEquals(3, deck.getDeckCards().get(0).getQuantity());

        List<DeckCardDto> dtos = deckAssembler.toDeckCardDtos(resolved);
        assertEquals(1, dtos.size());
        assertEquals("Judgment Dragon", dtos.get(0).getName());
        assertEquals(3, dtos.get(0).getQuantity());
    }

    @Test
    void testDeckAssemblerFromDtos() {
        Card card = new Card();
        card.setId(5L);
        card.setName("Judgment Dragon");

        List<DeckCardDto> dtos = List.of(
                new DeckCardDto(1L, 5L, "Judgment Dragon", "Effect Monster", "Desc", "Dragon", "Light", "None", "url",
                        "MAIN", 3));
        Map<Long, Card> cardMap = Map.of(5L, card);

        Deck deck = deckAssembler.assembleDeckFromDtos("Test Deck", "Edison", dtos, cardMap);

        assertEquals("Test Deck", deck.getName());
        assertEquals(1, deck.getDeckCards().size());
        assertEquals(card, deck.getDeckCards().get(0).getCard());
    }

    @Test
    void testValidationAdapter() {
        Card card = new Card();
        card.setId(5L);
        card.setName("Judgment Dragon");

        Deck deck = new Deck();
        deck.setName("Test Deck");
        deck.setFormatName(Format.EDISON);

        DeckCard deckCard = new DeckCard(deck, card, DeckSection.MAIN, 3);
        deck.setDeckCards(List.of(deckCard));

        when(formatRulesRepository.findByFormatName(Format.EDISON)).thenReturn(List.of());

        List<String> warnings = validationAdapter.validate(deck);

        assertNotNull(warnings);
        // Edison rules will flag Judgment Dragon if not legal or deck size is invalid
        // (under 40 cards)
        assertFalse(warnings.isEmpty());
        assertTrue(warnings.get(0).contains("Main Deck must contain between 40 and 60 cards"));
    }

    @Test
    void testCardDetailsTool() {
        Card detailsCard = new Card();
        detailsCard.setId(101L);
        detailsCard.setName("Honest");
        detailsCard.setType(CardType.EFFECT_MONSTER);
        detailsCard.setDescription("Send this card to GY to boost ATK.");
        detailsCard.setAtk(1100);
        detailsCard.setDef(1900);
        detailsCard.setLevel(4);

        when(cardRepository.findByName("Honest")).thenReturn(Optional.of(detailsCard));

        CardDetailsTool tool = new CardDetailsTool(cardRepository);
        CardDetailsTool.CardDetailsResponse response = tool.apply(new CardDetailsTool.CardDetailsRequest("Honest"));

        assertNotNull(response);
        assertEquals("Honest", response.name());
        assertEquals("Effect Monster", response.type());
        assertEquals("Send this card to GY to boost ATK.", response.description());
        assertEquals(1100, response.atk());
        assertEquals(1900, response.def());
        assertEquals(4, response.level());
    }

    @Test
    void testGetFormatRulesTool() {
        Card limitedCard = new Card();
        limitedCard.setName("Monster Reborn");

        com.deck.lab.backend.model.FormatRules rule = new com.deck.lab.backend.model.FormatRules(
                Format.EDISON, limitedCard, com.deck.lab.backend.model.CardStatus.LIMITED);

        when(formatRulesRepository.findByFormatName(Format.EDISON)).thenReturn(List.of(rule));

        GetFormatRulesTool tool = new GetFormatRulesTool(formatRulesRepository);
        GetFormatRulesTool.FormatRulesResponse response = tool
                .apply(new GetFormatRulesTool.FormatRulesRequest("Edison"));

        assertNotNull(response);
        assertEquals("EDISON", response.format());
        assertEquals(1, response.rules().size());
        assertEquals("Monster Reborn", response.rules().get(0).cardName());
        assertEquals("LIMITED", response.rules().get(0).status());
    }

    @Test
    void testGetArchetypeCardsTool() {
        Card card = new Card();
        card.setName("Lumina, Lightsworn Summoner");
        card.setType(CardType.EFFECT_MONSTER);
        card.setAttribute(CardAttribute.LIGHT);

        when(cardRepository.findAll(ArgumentMatchers.<Specification<Card>>any()))
                .thenReturn(List.of(card));

        GetArchetypeCardsTool tool = new GetArchetypeCardsTool(cardRepository);
        GetArchetypeCardsTool.ArchetypeCardsResponse response = tool
                .apply(new GetArchetypeCardsTool.ArchetypeCardsRequest("Lightsworn"));

        assertNotNull(response);
        assertEquals("Lightsworn", response.archetype());
        assertEquals(1, response.cards().size());
        assertEquals("Lumina, Lightsworn Summoner", response.cards().get(0).name());
        assertEquals("Effect Monster", response.cards().get(0).type());
    }

    @Test
    void testAnalyzeDeckStatsTool() {
        Card monster = new Card();
        monster.setName("Judgment Dragon");
        monster.setType(CardType.EFFECT_MONSTER);
        monster.setAtk(3000);
        monster.setDef(2600);
        monster.setLevel(8);

        Card spell = new Card();
        spell.setName("Solar Recharge");
        spell.setType(CardType.SPELL_CARD);

        Card trap = new Card();
        trap.setName("Beckoning Light");
        trap.setType(CardType.TRAP_CARD);

        when(cardRepository.findByName("Judgment Dragon")).thenReturn(Optional.of(monster));
        when(cardRepository.findByName("Solar Recharge")).thenReturn(Optional.of(spell));
        when(cardRepository.findByName("Beckoning Light")).thenReturn(Optional.of(trap));

        AnalyzeDeckStatsTool tool = new AnalyzeDeckStatsTool(cardRepository);
        AnalyzeDeckStatsTool.DeckStatsResponse response = tool.apply(
                new AnalyzeDeckStatsTool.DeckStatsRequest(
                        List.of("Judgment Dragon", "Solar Recharge", "Beckoning Light")));

        assertNotNull(response);
        assertEquals(3, response.totalCards());
        assertEquals(1, response.monsterCount());
        assertEquals(1, response.spellCount());
        assertEquals(1, response.trapCount());
        assertEquals(3000.0, response.averageAtk());
        assertEquals(2600.0, response.averageDef());
        assertEquals(8.0, response.averageLevel());
    }

    @Test
    void testCardResolverNullAndEmptyInputs() {
        assertTrue(cardResolver.resolveCards(null).isEmpty());
        assertTrue(cardResolver.resolveSuggestions(null).isEmpty());

        assertTrue(cardResolver.resolveCards(List.of()).isEmpty());
        assertTrue(cardResolver.resolveSuggestions(List.of()).isEmpty());

        List<CardEntryDto> rawEntries = List.of(
            new CardEntryDto(null, "MAIN", 3), 
            new CardEntryDto("  ", "MAIN", 3)
        );
        assertTrue(cardResolver.resolveCards(rawEntries).isEmpty());
    }

    @Test
    void testCardResolverQuantityAndSectionNormalization() {
        Card card = new Card();
        card.setId(10L);
        card.setName("Sangan");
        card.setType(CardType.EFFECT_MONSTER);

        when(cardRepository.findByName("Sangan")).thenReturn(Optional.of(card));

        List<CardEntryDto> rawEntries = List.of(
            new CardEntryDto("Sangan", "MAIN", null),
            new CardEntryDto("Sangan", "MAIN", 0),
            new CardEntryDto("Sangan", "MAIN", -5),
            new CardEntryDto("Sangan", "MAIN", 5)
        );

        List<CardResolver.ResolvedCardEntry> resolved = cardResolver.resolveCards(rawEntries);
        assertEquals(4, resolved.size());
        assertEquals(1, resolved.get(0).quantity());
        assertEquals(1, resolved.get(1).quantity());
        assertEquals(1, resolved.get(2).quantity());
        assertEquals(3, resolved.get(3).quantity());

        List<CardEntryDto> sectionEntries = List.of(
            new CardEntryDto("Sangan", null, 1),
            new CardEntryDto("Sangan", "INVALID_SECTION", 1),
            new CardEntryDto("Sangan", "side", 1),
            new CardEntryDto("Sangan", "EXTRA", 1)
        );

        List<CardResolver.ResolvedCardEntry> resolvedSections = cardResolver.resolveCards(sectionEntries);
        assertEquals(4, resolvedSections.size());
        assertEquals("MAIN", resolvedSections.get(0).section());
        assertEquals("MAIN", resolvedSections.get(1).section());
        assertEquals("SIDE", resolvedSections.get(2).section());
        assertEquals("EXTRA", resolvedSections.get(3).section());
    }

    @Test
    void testCardResolverResolveSuggestions() {
        Card card = new Card();
        card.setId(11L);
        card.setName("Cyber Dragon");
        card.setType(CardType.EFFECT_MONSTER);
        card.setImageUrlCropped("http://images/cropped.jpg");

        when(cardRepository.findByName("Cyber Dragon")).thenReturn(Optional.of(card));

        List<CardSuggestionDto> suggestions = List.of(
            new CardSuggestionDto("Cyber Dragon", "MAIN", "Great attacker", null, null, null)
        );

        List<CardSuggestionDto> resolved = cardResolver.resolveSuggestions(suggestions);
        assertEquals(1, resolved.size());
        assertEquals("Cyber Dragon", resolved.get(0).getName());
        assertEquals("MAIN", resolved.get(0).getSection());
        assertEquals("Great attacker", resolved.get(0).getSynergyReason());
        assertEquals(11L, resolved.get(0).getCardId());
        assertEquals("Effect Monster", resolved.get(0).getType());
        assertEquals("http://images/cropped.jpg", resolved.get(0).getImageUrl());

        List<CardSuggestionDto> sparseSuggestions = List.of(
            new CardSuggestionDto("Cyber Dragon", null, null, null, null, null)
        );

        List<CardSuggestionDto> sparseResolved = cardResolver.resolveSuggestions(sparseSuggestions);
        assertEquals(1, sparseResolved.size());
        assertEquals("MAIN", sparseResolved.get(0).getSection());
        assertEquals("Provides good synergy.", sparseResolved.get(0).getSynergyReason());
    }

    @Test
    void testDeckAssemblerInvalidInputs() {
        Deck deck = deckAssembler.assembleDeck("Test Deck", "INVALID_FORMAT", List.of());
        assertEquals("Test Deck", deck.getName());
        org.junit.jupiter.api.Assertions.assertNull(deck.getFormatName());

        Card card = new Card();
        card.setId(12L);
        card.setName("Gorz");
        List<CardResolver.ResolvedCardEntry> resolved = List.of(
            new CardResolver.ResolvedCardEntry(card, "INVALID_SECTION", 1)
        );
        Deck assembled = deckAssembler.assembleDeck("Gorz Deck", "Edison", resolved);
        assertEquals(1, assembled.getDeckCards().size());
        org.junit.jupiter.api.Assertions.assertNull(assembled.getDeckCards().get(0).getSection());
    }

    @Test
    void testValidationAdapterNullFormat() {
        Card card = new Card();
        card.setId(13L);
        card.setName("Green Gadget");

        Deck deck = new Deck();
        deck.setName("Gadget Deck");
        deck.setFormatName(null);

        DeckCard deckCard = new DeckCard(deck, card, DeckSection.MAIN, 3);
        deck.setDeckCards(List.of(deckCard));

        List<String> warnings = validationAdapter.validate(deck);
        assertNotNull(warnings);
        assertFalse(warnings.isEmpty());
        assertTrue(warnings.get(0).contains("Main Deck must contain between 40 and 60 cards"));
    }
}
