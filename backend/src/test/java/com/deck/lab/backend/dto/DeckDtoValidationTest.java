package com.deck.lab.backend.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class DeckDtoValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void validate_withValidDeckDto_hasNoViolations() {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Frog Monarch");
        deckDto.setFormatName("Edison");
        deckDto.setDescription("Tribute summon focus");
        deckDto.setDeckCards(new ArrayList<>());

        Set<ConstraintViolation<DeckResponseDto>> violations = validator.validate(deckDto);
        assertTrue(violations.isEmpty(), "Valid DeckDto should have no violations");
    }

    @Test
    void validate_withBlankName_failsValidation() {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("   "); // Blank name
        deckDto.setFormatName("TCG");

        Set<ConstraintViolation<DeckResponseDto>> violations = validator.validate(deckDto);
        assertEquals(1, violations.size());
        assertEquals("Deck name is required", violations.iterator().next().getMessage());
    }

    @Test
    void validate_withBlankFormatName_failsValidation() {
        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Elemental Hero");
        deckDto.setFormatName(""); // Blank format name

        Set<ConstraintViolation<DeckResponseDto>> violations = validator.validate(deckDto);
        assertEquals(1, violations.size());
        assertEquals("Format name is required", violations.iterator().next().getMessage());
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

        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Valid Name");
        deckDto.setFormatName("Goat");
        deckDto.setDeckCards(List.of(invalidCardDto));

        // Validation of parent should cascade to nested elements annotated with @Valid
        Set<ConstraintViolation<DeckResponseDto>> violations = validator.validate(deckDto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Quantity cannot exceed 3")));
    }
}
