package com.deck.lab.backend.dto.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeckDtoValidatorTest {

    private CardRepository cardRepository;
    private FormatRulesRepository formatRulesRepository;
    private DeckDtoValidator validator;
    private ConstraintValidatorContext context;
    private ConstraintValidatorContext.ConstraintViolationBuilder violationBuilder;
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    @BeforeEach
    void setUp() {
        cardRepository = mock(CardRepository.class);
        formatRulesRepository = mock(FormatRulesRepository.class);
        validator = new DeckDtoValidator(cardRepository, formatRulesRepository);

        context = mock(ConstraintValidatorContext.class);
        violationBuilder = mock(ConstraintValidatorContext.ConstraintViolationBuilder.class);
        nodeBuilder = mock(ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext.class);

        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(violationBuilder);
        when(violationBuilder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        when(nodeBuilder.addConstraintViolation()).thenReturn(context);
    }

    private List<Card> setupMockCards(int count) {
        List<Card> cards = new ArrayList<>();
        for (long i = 1; i <= count; i++) {
            Card card = new Card();
            card.setId(i);
            card.setName("Card " + i);
            card.setType("Normal Monster");
            cards.add(card);
        }
        when(cardRepository.findAllById(any())).thenReturn(cards);
        return cards;
    }

    private DeckDto createBaseDeck(int cardCount, int qtyPerCard) {
        List<DeckCardDto> dtos = new ArrayList<>();
        for (long i = 1; i <= cardCount; i++) {
            DeckCardDto dto = new DeckCardDto();
            dto.setCardId(i);
            dto.setSection("MAIN");
            dto.setQuantity(qtyPerCard);
            dtos.add(dto);
        }
        DeckDto deckDto = new DeckDto();
        deckDto.setName("Test Deck");
        deckDto.setFormatName("Goat");
        deckDto.setDeckCards(dtos);
        return deckDto;
    }

    @Test
    void isValid_withValidDeck_returnsTrue() {
        // 14 cards x 3 quantity = 42 cards (valid size: 40-60)
        setupMockCards(14);
        DeckDto deckDto = createBaseDeck(14, 3);

        assertTrue(validator.isValid(deckDto, context));
    }

    @Test
    void isValid_withEmptyDeck_returnsFalse() {
        DeckDto deckDto = new DeckDto();
        deckDto.setDeckCards(Collections.emptyList());

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(contains("Main Deck must contain between 40 and 60"));
    }

    @Test
    void isValid_withTooFewCards_returnsFalse() {
        // 13 cards x 3 = 39 cards (invalid size: <40)
        setupMockCards(13);
        DeckDto deckDto = createBaseDeck(13, 3);

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(contains("Main Deck must contain between 40 and 60"));
    }

    @Test
    void isValid_withTooManyCards_returnsFalse() {
        // 21 cards x 3 = 63 cards (invalid size: >60)
        setupMockCards(21);
        DeckDto deckDto = createBaseDeck(21, 3);

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(contains("Main Deck must contain between 40 and 60"));
    }

    @Test
    void isValid_withExceededGeneralCopyLimit_returnsFalse() {
        // 13 cards x 3 = 39 cards + 1 card x 4 = 43 cards. Main deck size is 43 (valid)
        // but card 14 has 4 copies (invalid)
        setupMockCards(14);
        DeckDto deckDto = createBaseDeck(13, 3);

        DeckCardDto invalidDto = new DeckCardDto();
        invalidDto.setCardId(14L);
        invalidDto.setSection("MAIN");
        invalidDto.setQuantity(4);
        deckDto.getDeckCards().add(invalidDto);

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(contains("exceeds the limit of 3 copies"));
    }

    @Test
    void isValid_withExtraDeckMonsterInMainDeck_returnsFalse() {
        List<Card> cards = setupMockCards(14);
        // Make card 14 a Fusion Monster (Extra deck monster)
        cards.get(13).setType("Fusion Monster");

        DeckDto deckDto = createBaseDeck(14, 3);

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(
                contains("Extra Deck monster 'Card 14' must be placed in the EXTRA section"));
    }

    @Test
    void isValid_withMainDeckCardInExtraDeck_returnsFalse() {
        // 13 cards of qty 3 in MAIN = 39. Plus 1 card of qty 1 in EXTRA = 40.
        // Card 14 is a Normal Monster (Main deck card)
        setupMockCards(14);

        DeckDto deckDto = createBaseDeck(13, 3);
        DeckCardDto extraCard = new DeckCardDto();
        extraCard.setCardId(14L);
        extraCard.setSection("EXTRA");
        extraCard.setQuantity(1);
        deckDto.getDeckCards().add(extraCard);

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(
                contains("Main Deck card 'Card 14' cannot be placed in the EXTRA section"));
    }

    @Test
    void isValid_withForbiddenCard_returnsFalse() {
        List<Card> cards = setupMockCards(14);
        DeckDto deckDto = createBaseDeck(14, 3);

        // Make Card 1 (ID 1) forbidden in Goat format
        FormatRules forbiddenRule = new FormatRules("Goat", cards.get(0), CardStatus.FORBIDDEN);
        when(formatRulesRepository.findByFormatName("Goat")).thenReturn(List.of(forbiddenRule));

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(contains("Card 'Card 1' is forbidden in format 'Goat'"));
    }

    @Test
    void isValid_withLimitedCardExceeded_returnsFalse() {
        List<Card> cards = setupMockCards(14);
        DeckDto deckDto = createBaseDeck(14, 3); // Card 1 has 3 copies

        // Make Card 1 (ID 1) limited in Goat format (max 1 copy)
        FormatRules limitedRule = new FormatRules("Goat", cards.get(0), CardStatus.LIMITED);
        when(formatRulesRepository.findByFormatName("Goat")).thenReturn(List.of(limitedRule));

        assertFalse(validator.isValid(deckDto, context));
        verify(context).buildConstraintViolationWithTemplate(
                contains("Card 'Card 1' is limited in format 'Goat' (max 1 copies allowed, found 3)"));
    }
}
