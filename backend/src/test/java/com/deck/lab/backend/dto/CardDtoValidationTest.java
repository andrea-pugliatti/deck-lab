package com.deck.lab.backend.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.request.CardSaveRequestDto;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@DisplayName("CardSaveRequestDto Bean Validation Tests")
class CardDtoValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Valid CardSaveRequestDto should have zero validation violations")
    void validate_withValidCardSaveRequestDto_hasNoViolations() {
        CardSaveRequestDto cardDto = new CardSaveRequestDto(
                46986414L,
                "Blue-Eyes White Dragon",
                CardType.NORMAL_MONSTER,
                "This legendary dragon is a powerful engine of destruction.",
                CardRace.DRAGON,
                CardAttribute.LIGHT,
                "Blue-Eyes",
                "/cards/images/1.jpg",
                "/cards/images/cropped/1.jpg",
                FrameType.NORMAL,
                3000,
                2500,
                8,
                null,
                null);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertTrue(violations.isEmpty(), "Valid CardSaveRequestDto should have no violations");
    }

    @Test
    @DisplayName("CardSaveRequestDto with blank name should fail validation")
    void validate_withBlankName_failsValidation() {
        CardSaveRequestDto cardDto = new CardSaveRequestDto();
        cardDto.setName("   ");
        cardDto.setType(CardType.NORMAL_MONSTER);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Card name is required", violations.iterator().next().getMessage());
    }

    @Test
    @DisplayName("CardSaveRequestDto with null name should fail validation")
    void validate_withNullName_failsValidation() {
        CardSaveRequestDto cardDto = new CardSaveRequestDto();
        cardDto.setName(null);
        cardDto.setType(CardType.SPELL_CARD);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Card name is required", violations.iterator().next().getMessage());
    }

    @Test
    @DisplayName("CardSaveRequestDto with null type should fail validation")
    void validate_withNullType_failsValidation() {
        CardSaveRequestDto cardDto = new CardSaveRequestDto();
        cardDto.setName("Dark Hole");
        cardDto.setType(null);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertEquals(1, violations.size());
        assertEquals("Card type is required", violations.iterator().next().getMessage());
    }
}
