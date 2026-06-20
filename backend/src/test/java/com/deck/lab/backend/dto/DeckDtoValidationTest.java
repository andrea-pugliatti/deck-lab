package com.deck.lab.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorFactory;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.validation.DeckDtoValidator;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeckDtoValidationTest {

    private Validator validator;
    private CardRepository cardRepository;
    private FormatRulesRepository formatRulesRepository;

    @BeforeEach
    void setUp() {
        cardRepository = mock(CardRepository.class);
        formatRulesRepository = mock(FormatRulesRepository.class);

        // Mock cardRepository to return mock normal monster cards for any request
        when(cardRepository.findAllById(anyList())).thenAnswer(invocation -> {
            List<Long> ids = invocation.getArgument(0);
            List<Card> cards = new ArrayList<>();
            for (Long id : ids) {
                Card card = new Card();
                card.setId(id);
                card.setName("Mock Card " + id);
                card.setType("Normal Monster");
                cards.add(card);
            }
            return cards;
        });

        // Mock formatRulesRepository to return no rules by default
        when(formatRulesRepository.findByFormatName(anyString())).thenReturn(Collections.emptyList());

        // Custom ConstraintValidatorFactory to inject mocks into DeckDtoValidator
        ConstraintValidatorFactory customFactory = new ConstraintValidatorFactory() {
            @SuppressWarnings("unchecked")
            @Override
            public <T extends ConstraintValidator<?, ?>> T getInstance(Class<T> key) {
                if (key == DeckDtoValidator.class) {
                    return (T) new DeckDtoValidator(cardRepository, formatRulesRepository);
                }
                try {
                    return key.getDeclaredConstructor().newInstance();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            @Override
            public void releaseInstance(ConstraintValidator<?, ?> instance) {
            }
        };

        ValidatorFactory factory = Validation.byDefaultProvider()
                .configure()
                .constraintValidatorFactory(customFactory)
                .buildValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void validate_withValidDeckDto_hasNoViolations() {
        // Construct a valid deck of 40 cards (13 cards x 3 copies + 1 card x 1 copy)
        List<DeckCardDto> cardDtos = new ArrayList<>();
        for (long i = 1; i <= 13; i++) {
            DeckCardDto cardDto = new DeckCardDto();
            cardDto.setCardId(i);
            cardDto.setSection("MAIN");
            cardDto.setQuantity(3);
            cardDtos.add(cardDto);
        }
        DeckCardDto lastCard = new DeckCardDto();
        lastCard.setCardId(14L);
        lastCard.setSection("MAIN");
        lastCard.setQuantity(1);
        cardDtos.add(lastCard);

        DeckDto deckDto = new DeckDto();
        deckDto.setName("Frog Monarch");
        deckDto.setFormatName("Edison");
        deckDto.setDescription("Tribute summon focus");
        deckDto.setDeckCards(cardDtos);

        Set<ConstraintViolation<DeckDto>> violations = validator.validate(deckDto);
        assertTrue(violations.isEmpty(), "Valid DeckDto should have no violations: " + 
                (violations.isEmpty() ? "" : violations.iterator().next().getMessage()));
    }

    @Test
    void validate_withBlankName_failsValidation() {
        DeckDto deckDto = new DeckDto();
        deckDto.setName("   "); // Blank name
        deckDto.setFormatName("TCG");

        Set<ConstraintViolation<DeckDto>> violations = validator.validate(deckDto);
        // Expecting 2 violations: blank name and empty deckCards size (0 cards)
        assertEquals(2, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Deck name is required")));
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Main Deck must contain between 40 and 60 cards. Current size: 0")));
    }

    @Test
    void validate_withBlankFormatName_failsValidation() {
        DeckDto deckDto = new DeckDto();
        deckDto.setName("Elemental Hero");
        deckDto.setFormatName(""); // Blank format name

        Set<ConstraintViolation<DeckDto>> violations = validator.validate(deckDto);
        // Expecting 2 violations: blank format name and empty deckCards size (0 cards)
        assertEquals(2, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Format name is required")));
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Main Deck must contain between 40 and 60 cards. Current size: 0")));
    }

    @Test
    void validate_withNullCardId_failsValidation() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(null); // Invalid
        cardDto.setSection("MAIN");
        cardDto.setQuantity(2);

        Set<ConstraintViolation<DeckCardDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Card ID is required", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withBlankSection_failsValidation() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(1L);
        cardDto.setSection(""); // Invalid
        cardDto.setQuantity(2);

        Set<ConstraintViolation<DeckCardDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Section is required", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withQuantityTooLow_failsValidation() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(1L);
        cardDto.setSection("MAIN");
        cardDto.setQuantity(0); // Invalid (min 1)

        Set<ConstraintViolation<DeckCardDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Quantity must be at least 1", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withQuantityTooHigh_failsValidation() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(1L);
        cardDto.setSection("MAIN");
        cardDto.setQuantity(4); // Invalid (max 3)

        Set<ConstraintViolation<DeckCardDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Quantity cannot exceed 3", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withNullQuantity_failsValidation() {
        DeckCardDto cardDto = new DeckCardDto();
        cardDto.setCardId(1L);
        cardDto.setSection("MAIN");
        cardDto.setQuantity(null); // Invalid

        Set<ConstraintViolation<DeckCardDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Quantity is required", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withNestedInvalidCard_failsValidation() {
        DeckCardDto invalidCardDto = new DeckCardDto();
        invalidCardDto.setCardId(1L);
        invalidCardDto.setSection("MAIN");
        invalidCardDto.setQuantity(5); // Invalid quantity (>3)

        DeckDto deckDto = new DeckDto();
        deckDto.setName("Valid Name");
        deckDto.setFormatName("Goat");
        deckDto.setDeckCards(List.of(invalidCardDto));

        // Validation of parent should cascade to nested elements annotated with @Valid
        Set<ConstraintViolation<DeckDto>> violations = validator.validate(deckDto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Quantity cannot exceed 3")));
    }
}
