package com.deck.lab.backend.service.generation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.config.PromptConfig;
import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckGenerateRequestDto;
import com.deck.lab.backend.dto.request.DeckSuggestRequestDto;
import com.deck.lab.backend.dto.response.CardSuggestionListResponseDto;
import com.deck.lab.backend.dto.response.CardSuggestionResponseDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.Strategy;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.service.generation.model.CardEntry;
import com.deck.lab.backend.service.generation.model.DeckGenerateAiResponse;
import com.deck.lab.backend.service.generation.model.ResolvedCardEntry;
import com.deck.lab.backend.service.generation.tool.AnalyzeDeckStatsTool;
import com.deck.lab.backend.service.generation.tool.CardDetailsTool;
import com.deck.lab.backend.service.generation.tool.CardSearchTool;
import com.deck.lab.backend.service.generation.tool.GetArchetypeCardsTool;
import com.deck.lab.backend.service.generation.tool.GetFormatRulesTool;
import com.deck.lab.backend.service.generation.tool.dto.ArchetypeCardsRequest;
import com.deck.lab.backend.service.generation.tool.dto.ArchetypeCardsResponse;
import com.deck.lab.backend.service.generation.tool.dto.CardDetailsRequest;
import com.deck.lab.backend.service.generation.tool.dto.CardDetailsResponse;
import com.deck.lab.backend.service.generation.tool.dto.CardSearchRequest;
import com.deck.lab.backend.service.generation.tool.dto.CardSearchResponse;
import com.deck.lab.backend.service.generation.tool.dto.DeckStatsRequest;
import com.deck.lab.backend.service.generation.tool.dto.DeckStatsResponse;
import com.deck.lab.backend.service.generation.tool.dto.FormatRulesRequest;
import com.deck.lab.backend.service.generation.tool.dto.FormatRulesResponse;
import com.deck.lab.backend.validation.DeckValidationEngine;

@DisplayName("AI Generation Submodules Unit Tests")
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
        PromptConfig promptConfig = new PromptConfig();
        promptConfig.setFormats(Map.of(
                "EDISON",
                "- Format: Edison Format (2010 rules, anchored as of July 2026).",
                "DEFAULT",
                "- Format: Modern TCG rules (anchored as of July 2026)."));
        promptConfig.setPlaystyles(Map.of(
                "combo",
                "- Playstyle Guideline: Combo",
                "milling",
                "- Playstyle Guideline: Milling",
                "DEFAULT",
                "- Playstyle Guideline: Standard / Balanced."));
        PromptConfig.SystemTemplates systemTemplates = new PromptConfig.SystemTemplates();
        systemTemplates.setDraft(
                "Archetype: {archetype}, Strategy: {strategy}, Custom: {customPrompt}, Rules: {formatRules}, Playstyle: {playstyleGuide}, Extra: %s");
        systemTemplates.setRefinement(
                "Archetype: {archetype}, Strategy: {strategy}, Custom: {customPrompt}, Rules: {formatRules}, Playstyle: {playstyleGuide}, Resolved: {resolvedCards}, Unresolved: {unresolvedCards}, Warnings: {validationWarnings}, Extra: %s");
        systemTemplates.setSuggestion("Rules: {formatRules}, Current: {currentCards}, Extra: %s");
        promptConfig.setSystem(systemTemplates);
        promptBuilder = new PromptBuilder(cardRepository, promptConfig);
        responseParser = new ResponseParser();
        cardResolver = new CardResolver(cardRepository);
        deckAssembler = new DeckAssembler();
        validationAdapter = new ValidationAdapter(formatRulesRepository,
                new DeckValidationEngine());
        cardSearchTool = new CardSearchTool(cardRepository);
    }

    @Test
    @DisplayName("PromptBuilder should inject archetype, strategy, custom prompt, and rules into draft prompt")
    void buildDraftPrompt_should_populateSystemAndUserPrompts_when_requested() {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", Strategy.NONE,
                Format.EDISON, "Include JD");
        Prompt prompt = promptBuilder.buildDraftPrompt(request, "formatInstructionsTemplate");

        assertThat(prompt).isNotNull();
        String systemContent = prompt.getInstructions().get(0).getText();
        String userContent = prompt.getInstructions().get(1).getText();

        assertThat(systemContent)
                .contains("Lightsworn")
                .contains("None")
                .contains("Include JD")
                .contains("formatInstructionsTemplate");
        assertThat(userContent).contains("Edison");
    }

    @Test
    @DisplayName("PromptBuilder should inject resolved cards, unresolved names, and warnings into refinement prompt")
    void buildRefinementPrompt_should_includeContextAndWarnings_when_requested() {
        DeckGenerateRequestDto request = new DeckGenerateRequestDto("Lightsworn", Strategy.NONE,
                Format.EDISON, "Include JD");
        com.deck.lab.backend.model.Card card = new com.deck.lab.backend.model.Card();
        card.setName("Judgment Dragon");
        card.setType(com.deck.lab.backend.model.CardType.EFFECT_MONSTER);
        card.setAttribute(com.deck.lab.backend.model.CardAttribute.LIGHT);
        card.setLevel(8);
        List<ResolvedCardEntry> resolved = List
                .of(new ResolvedCardEntry(card, DeckSection.MAIN, 3));
        List<String> unresolved = List.of("UnresolvedCard");
        List<String> warnings = List.of("Warning 1");

        Prompt prompt = promptBuilder.buildRefinementPrompt(request,
                resolved,
                unresolved,
                warnings,
                "formatInstructionsTemplate");

        assertThat(prompt).isNotNull();
        String systemContent = prompt.getInstructions().get(0).getText();
        assertThat(systemContent)
                .contains("Judgment Dragon")
                .contains("UnresolvedCard")
                .contains("Warning 1")
                .contains("formatInstructionsTemplate");
    }

    @Test
    @DisplayName("PromptBuilder should populate suggestion prompt with current cards or empty deck marker")
    void buildSuggestionPrompt_should_includeFormatAndCards_when_invoked() {
        DeckSuggestRequestDto request = new DeckSuggestRequestDto("Edison", List.of());
        Prompt prompt = promptBuilder.buildSuggestionPrompt(request, "formatInstructionsTemplate");

        assertThat(prompt).isNotNull();
        String systemContent = prompt.getInstructions().get(0).getText();
        assertThat(systemContent)
                .contains("Edison")
                .contains("(Empty Deck)");
    }

    @Test
    @DisplayName("ResponseParser should sanitize markdown blocks and trailing commas when parsing JSON")
    void parseGenerationResponse_should_sanitizeAndParseJson_when_rawAiOutputReceived() {
        String rawGenResponse = "{\"name\": \"Lightsworn Mill\", \"description\": \"Fast milling deck\", \"cards\": [{\"name\": \"Judgment Dragon\", \"section\": \"MAIN\", \"quantity\": 3}]}";
        DeckGenerateAiResponse genResponse = responseParser.parseGenerationResponse(rawGenResponse);

        assertThat(genResponse).isNotNull();
        assertThat(genResponse.getName()).isEqualTo("Lightsworn Mill");
        assertThat(genResponse.getCards()).hasSize(1);
        assertThat(genResponse.getCards().get(0).getName()).isEqualTo("Judgment Dragon");

        String rawSuggestResponse = "{\"suggestions\": [{\"name\": \"Solar Recharge\", \"section\": \"MAIN\", \"synergyReason\": \"Draw and mill.\"}]}";
        CardSuggestionListResponseDto suggestResponse = responseParser
                .parseSuggestionResponse(rawSuggestResponse);

        assertThat(suggestResponse).isNotNull();
        assertThat(suggestResponse.getSuggestions()).hasSize(1);
        assertThat(suggestResponse.getSuggestions().get(0).getName()).isEqualTo("Solar Recharge");

        // Test with trailing commas
        String trailingCommas = "{\"name\": \"Lightsworn, Mill,\", \"description\": \"Fast mill\", \"cards\": [{\"name\": \"Judgment Dragon\", \"section\": \"MAIN\", \"quantity\": 3},]}";
        DeckGenerateAiResponse cleanResponse1 = responseParser
                .parseGenerationResponse(trailingCommas);
        assertThat(cleanResponse1).isNotNull();
        assertThat(cleanResponse1.getName()).isEqualTo("Lightsworn, Mill,");

        // Test with markdown code blocks and duplicate commas
        String markdownWithDuplicateCommas = "```json\n{\"name\": \"Lightsworn\", \"cards\": [{\"name\": \"JD\"}, , {\"name\": \"Lumina\"}]}\n```";
        DeckGenerateAiResponse cleanResponse2 = responseParser
                .parseGenerationResponse(markdownWithDuplicateCommas);
        assertThat(cleanResponse2).isNotNull();
        assertThat(cleanResponse2.getName()).isEqualTo("Lightsworn");
        assertThat(cleanResponse2.getCards()).hasSize(2);
    }

    @Test
    @DisplayName("CardResolver should lookup card by exact name and resolve section/quantity")
    void resolveCards_should_resolveExactNameMatches_when_cardsExist() {
        Card jdCard = new Card();
        jdCard.setId(1L);
        jdCard.setName("Judgment Dragon");
        jdCard.setType(CardType.EFFECT_MONSTER);

        when(cardRepository.findByName("Judgment Dragon")).thenReturn(Optional.of(jdCard));

        List<CardEntry> rawEntries = List.of(
                new CardEntry("Judgment Dragon", "MAIN", 3),
                new CardEntry("Unknown Card", "EXTRA", 1));

        List<ResolvedCardEntry> resolved = cardResolver.resolveCards(rawEntries);

        assertThat(resolved).hasSize(1);
        assertThat(resolved.get(0).card()).isEqualTo(jdCard);
        assertThat(resolved.get(0).section()).isEqualTo(DeckSection.MAIN);
        assertThat(resolved.get(0).quantity()).isEqualTo(3);
    }

    @Test
    @DisplayName("CardResolver should use case-insensitive substring fallback when exact match is missing")
    void lookupCard_should_fallbackToSubstringMatch_when_exactMatchNotFound() {
        Card lumina = new Card();
        lumina.setId(2L);
        lumina.setName("Lumina, Lightsworn Summoner");

        when(cardRepository.findByName("Lumina")).thenReturn(Optional.empty());
        when(cardRepository.findByNameContainingIgnoreCase("Lumina")).thenReturn(List.of(lumina));

        Optional<Card> resolved = cardResolver.lookupCard("Lumina");

        assertThat(resolved).isPresent();
        assertThat(resolved.get().getName()).isEqualTo("Lumina, Lightsworn Summoner");
    }

    @Test
    @DisplayName("CardSearchTool should query repository and map results to DTOs")
    void apply_should_searchCards_when_invoked() {
        Card card = new Card();
        card.setId(3L);
        card.setName("Honest");
        card.setType(CardType.EFFECT_MONSTER);
        card.setArchetype("None");

        when(cardRepository.findByNameContainingIgnoreCase("Honest")).thenReturn(List.of(card));

        CardSearchResponse response = cardSearchTool
                .apply(new CardSearchRequest("Honest"));

        assertThat(response).isNotNull();
        assertThat(response.results()).hasSize(1);
        assertThat(response.results().get(0).name()).isEqualTo("Honest");
    }

    @Test
    @DisplayName("DeckAssembler should build Deck entity and response DTOs from resolved cards")
    void assembleDeck_should_buildDeckEntity_when_resolvedCardsProvided() {
        Card card = new Card();
        card.setId(5L);
        card.setName("Judgment Dragon");
        card.setType(CardType.EFFECT_MONSTER);

        List<ResolvedCardEntry> resolved = List.of(
                new ResolvedCardEntry(card, "MAIN", 3));

        Deck deck = deckAssembler.assembleDeck("AI Deck", "Edison", resolved);

        assertThat(deck.getName()).isEqualTo("AI Deck");
        assertThat(deck.getFormatName()).isEqualTo(Format.EDISON);
        assertThat(deck.getDeckCards()).hasSize(1);
        assertThat(deck.getDeckCards().get(0).getCard()).isEqualTo(card);
        assertThat(deck.getDeckCards().get(0).getSection()).isEqualTo(DeckSection.MAIN);
        assertThat(deck.getDeckCards().get(0).getQuantity()).isEqualTo(3);

        List<DeckCardResponseDto> dtos = deckAssembler.toDeckCardDtos(resolved);
        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getName()).isEqualTo("Judgment Dragon");
        assertThat(dtos.get(0).getQuantity()).isEqualTo(3);
    }

    @Test
    @DisplayName("DeckAssembler should build Deck entity from request DTOs and card lookup map")
    void assembleDeckFromDtos_should_buildDeck_when_dtosAndMapProvided() {
        Card card = new Card();
        card.setId(5L);
        card.setName("Judgment Dragon");

        List<DeckCardRequestDto> dtos = List.of(
                new DeckCardRequestDto(1L, 5L, "MAIN", 3));
        Map<Long, Card> cardMap = Map.of(5L, card);

        Deck deck = deckAssembler.assembleDeckFromDtos("Test Deck", "Edison", dtos, cardMap);

        assertThat(deck.getName()).isEqualTo("Test Deck");
        assertThat(deck.getDeckCards()).hasSize(1);
        assertThat(deck.getDeckCards().get(0).getCard()).isEqualTo(card);
    }

    @Test
    @DisplayName("ValidationAdapter should invoke validation engine and return format warnings")
    void validate_should_returnValidationWarnings_when_deckViolatesRules() {
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

        assertThat(warnings).isNotNull().isNotEmpty();
        assertThat(warnings.get(0)).contains("Main Deck must contain between 40 and 60 cards");
    }

    @Test
    @DisplayName("CardDetailsTool should return full card statistics when card name is found")
    void apply_should_returnCardDetails_when_cardExists() {
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
        CardDetailsResponse response = tool.apply(new CardDetailsRequest("Honest"));

        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("Honest");
        assertThat(response.type()).isEqualTo("Effect Monster");
        assertThat(response.description()).isEqualTo("Send this card to GY to boost ATK.");
        assertThat(response.atk()).isEqualTo(1100);
        assertThat(response.def()).isEqualTo(1900);
        assertThat(response.level()).isEqualTo(4);
    }

    @Test
    @DisplayName("GetFormatRulesTool should query format banlist rules and map to response DTO")
    void apply_should_returnFormatRules_when_formatQueried() {
        Card limitedCard = new Card();
        limitedCard.setName("Monster Reborn");

        com.deck.lab.backend.model.FormatRules rule = new com.deck.lab.backend.model.FormatRules(
                Format.EDISON, limitedCard, com.deck.lab.backend.model.CardStatus.LIMITED);

        when(formatRulesRepository.findByFormatName(Format.EDISON)).thenReturn(List.of(rule));

        GetFormatRulesTool tool = new GetFormatRulesTool(formatRulesRepository);
        FormatRulesResponse response = tool
                .apply(new FormatRulesRequest("Edison"));

        assertThat(response).isNotNull();
        assertThat(response.format()).isEqualTo("EDISON");
        assertThat(response.rules()).hasSize(1);
        assertThat(response.rules().get(0).cardName()).isEqualTo("Monster Reborn");
        assertThat(response.rules().get(0).status()).isEqualTo(CardStatus.LIMITED);
    }

    @Test
    @DisplayName("GetArchetypeCardsTool should search archetype cards via JPA specification")
    void apply_should_returnArchetypeCards_when_archetypeMatches() {
        Card card = new Card();
        card.setName("Lumina, Lightsworn Summoner");
        card.setType(CardType.EFFECT_MONSTER);
        card.setAttribute(CardAttribute.LIGHT);

        when(cardRepository.findAll(ArgumentMatchers.<Specification<Card>>any()))
                .thenReturn(List.of(card));

        GetArchetypeCardsTool tool = new GetArchetypeCardsTool(cardRepository);
        ArchetypeCardsResponse response = tool
                .apply(new ArchetypeCardsRequest("Lightsworn"));

        assertThat(response).isNotNull();
        assertThat(response.archetype()).isEqualTo("Lightsworn");
        assertThat(response.cards()).hasSize(1);
        assertThat(response.cards().get(0).name()).isEqualTo("Lumina, Lightsworn Summoner");
        assertThat(response.cards().get(0).type()).isEqualTo("Effect Monster");
    }

    @Test
    @DisplayName("AnalyzeDeckStatsTool should compute aggregated deck composition and stat averages")
    void apply_should_computeDeckStats_when_cardListProvided() {
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
        DeckStatsResponse response = tool.apply(
                new DeckStatsRequest(
                        List.of("Judgment Dragon", "Solar Recharge", "Beckoning Light")));

        assertThat(response).isNotNull();
        assertThat(response.totalCards()).isEqualTo(3);
        assertThat(response.monsterCount()).isEqualTo(1);
        assertThat(response.spellCount()).isEqualTo(1);
        assertThat(response.trapCount()).isEqualTo(1);
        assertThat(response.averageAtk()).isEqualTo(3000.0);
        assertThat(response.averageDef()).isEqualTo(2600.0);
        assertThat(response.averageLevel()).isEqualTo(8.0);
    }

    @Test
    @DisplayName("CardResolver should handle null and empty input collections gracefully")
    void resolveCards_should_handleNullAndEmptyInputs() {
        assertThat(cardResolver.resolveCards(null)).isEmpty();
        assertThat(cardResolver.resolveSuggestions(null)).isEmpty();

        assertThat(cardResolver.resolveCards(List.of())).isEmpty();
        assertThat(cardResolver.resolveSuggestions(List.of())).isEmpty();

        List<CardEntry> rawEntries = List.of(
                new CardEntry(null, "MAIN", 3),
                new CardEntry("  ", "MAIN", 3));
        assertThat(cardResolver.resolveCards(rawEntries)).isEmpty();
    }

    @Test
    @DisplayName("CardResolver should clamp quantities to positive range and default invalid sections to MAIN")
    void resolveCards_should_normalizeQuantitiesAndSections_when_inputsAreNonStandard() {
        Card card = new Card();
        card.setId(10L);
        card.setName("Sangan");
        card.setType(CardType.EFFECT_MONSTER);

        when(cardRepository.findByName("Sangan")).thenReturn(Optional.of(card));

        List<CardEntry> rawEntries = List.of(
                new CardEntry("Sangan", "MAIN", null),
                new CardEntry("Sangan", "MAIN", 0),
                new CardEntry("Sangan", "MAIN", -5),
                new CardEntry("Sangan", "MAIN", 5));

        List<ResolvedCardEntry> resolved = cardResolver.resolveCards(rawEntries);
        assertThat(resolved).hasSize(4);
        assertThat(resolved.get(0).quantity()).isEqualTo(1);
        assertThat(resolved.get(1).quantity()).isEqualTo(1);
        assertThat(resolved.get(2).quantity()).isEqualTo(1);
        assertThat(resolved.get(3).quantity()).isEqualTo(3);

        List<CardEntry> sectionEntries = List.of(
                new CardEntry("Sangan", (DeckSection) null, 1),
                new CardEntry("Sangan", "INVALID_SECTION", 1),
                new CardEntry("Sangan", DeckSection.SIDE, 1),
                new CardEntry("Sangan", DeckSection.EXTRA, 1));

        List<ResolvedCardEntry> resolvedSections = cardResolver.resolveCards(sectionEntries);
        assertThat(resolvedSections).hasSize(4);
        assertThat(resolvedSections.get(0).section()).isEqualTo(DeckSection.MAIN);
        assertThat(resolvedSections.get(1).section()).isEqualTo(DeckSection.MAIN);
        assertThat(resolvedSections.get(2).section()).isEqualTo(DeckSection.SIDE);
        assertThat(resolvedSections.get(3).section()).isEqualTo(DeckSection.EXTRA);
    }

    @Test
    @DisplayName("CardResolver should resolve suggestion metadata with card details and defaults")
    void resolveSuggestions_should_populateMetadata_when_cardFound() {
        Card card = new Card();
        card.setId(11L);
        card.setName("Cyber Dragon");
        card.setType(CardType.EFFECT_MONSTER);
        card.setImageUrlCropped("http://images/cropped.jpg");

        when(cardRepository.findByName("Cyber Dragon")).thenReturn(Optional.of(card));

        List<CardSuggestionResponseDto> suggestions = List.of(
                new CardSuggestionResponseDto("Cyber Dragon", DeckSection.MAIN, "Great attacker",
                        null, null,
                        null));

        List<CardSuggestionResponseDto> resolved = cardResolver.resolveSuggestions(suggestions);
        assertThat(resolved).hasSize(1);
        assertThat(resolved.get(0).getName()).isEqualTo("Cyber Dragon");
        assertThat(resolved.get(0).getSection()).isEqualTo(DeckSection.MAIN);
        assertThat(resolved.get(0).getSynergyReason()).isEqualTo("Great attacker");
        assertThat(resolved.get(0).getCardId()).isEqualTo(11L);
        assertThat(resolved.get(0).getType()).isEqualTo(CardType.EFFECT_MONSTER);
        assertThat(resolved.get(0).getImageUrl()).isEqualTo("http://images/cropped.jpg");

        List<CardSuggestionResponseDto> sparseSuggestions = List.of(
                new CardSuggestionResponseDto("Cyber Dragon", null, null, null, null, null));

        List<CardSuggestionResponseDto> sparseResolved = cardResolver
                .resolveSuggestions(sparseSuggestions);
        assertThat(sparseResolved).hasSize(1);
        assertThat(sparseResolved.get(0).getSection()).isEqualTo(DeckSection.MAIN);
        assertThat(sparseResolved.get(0).getSynergyReason()).isEqualTo("Provides good synergy.");
    }

    @Test
    @DisplayName("DeckAssembler should handle invalid format and section inputs gracefully")
    void assembleDeck_should_handleInvalidFormatAndSection_when_provided() {
        Deck deck = deckAssembler.assembleDeck("Test Deck", "INVALID_FORMAT", List.of());
        assertThat(deck.getName()).isEqualTo("Test Deck");
        assertThat(deck.getFormatName()).isNull();

        Card card = new Card();
        card.setId(12L);
        card.setName("Gorz");
        List<ResolvedCardEntry> resolved = List.of(
                new ResolvedCardEntry(card, "INVALID_SECTION", 1));
        Deck assembled = deckAssembler.assembleDeck("Gorz Deck", "Edison", resolved);
        assertThat(assembled.getDeckCards()).hasSize(1);
        assertThat(assembled.getDeckCards().get(0).getSection()).isEqualTo(DeckSection.MAIN);
    }

    @Test
    @DisplayName("ValidationAdapter should handle null format name gracefully with default rules")
    void validate_should_handleNullFormat_when_deckHasNoFormat() {
        Card card = new Card();
        card.setId(13L);
        card.setName("Green Gadget");

        Deck deck = new Deck();
        deck.setName("Gadget Deck");
        deck.setFormatName(null);

        DeckCard deckCard = new DeckCard(deck, card, DeckSection.MAIN, 3);
        deck.setDeckCards(List.of(deckCard));

        List<String> warnings = validationAdapter.validate(deck);
        assertThat(warnings).isNotNull().isNotEmpty();
        assertThat(warnings.get(0)).contains("Main Deck must contain between 40 and 60 cards");
    }
}
