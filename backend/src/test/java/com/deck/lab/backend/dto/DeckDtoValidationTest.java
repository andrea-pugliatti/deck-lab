package com.deck.lab.backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

import com.deck.lab.backend.dto.request.DeckCardRequestDto;
import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

@DisplayName("DeckSaveRequestDto and DeckCardRequestDto Bean Validation Tests")
class DeckDtoValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("validate should have no violations for valid DeckSaveRequestDto")
    void validate_should_haveNoViolations_when_deckSaveRequestDtoIsValid() {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Frog Monarch");
        deckDto.setFormatName(Format.EDISON);
        deckDto.setDescription("Tribute summon focus");
        deckDto.setDeckCards(new ArrayList<>());

        Set<ConstraintViolation<DeckSaveRequestDto>> violations = validator.validate(deckDto);
        assertThat(violations).isEmpty();
    }

    @ParameterizedTest(name = "Blank name \"{0}\" fails validation")
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "\t", "\n"})
    @DisplayName("validate should fail when deck name is blank or null")
    void validate_should_failValidation_when_deckNameIsBlankOrNull(String invalidName) {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName(invalidName);
        deckDto.setFormatName(Format.TCG);

        Set<ConstraintViolation<DeckSaveRequestDto>> violations = validator.validate(deckDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Deck name is required");
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("validate should fail when format name is null")
    void validate_should_failValidation_when_formatNameIsNull(Format nullFormat) {
        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Elemental Hero");
        deckDto.setFormatName(nullFormat);

        Set<ConstraintViolation<DeckSaveRequestDto>> violations = validator.validate(deckDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Format name is required");
    }

    @ParameterizedTest(name = "Valid quantity {0}")
    @ValueSource(ints = {1, 2, 3})
    @DisplayName("validate should succeed when DeckCardRequestDto quantity is within 1..3")
    void validate_should_succeedValidation_when_quantityIsValid(int validQuantity) {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(1L);
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(validQuantity);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).isEmpty();
    }

    @ParameterizedTest(name = "Invalid quantity {0}")
    @ValueSource(ints = {0, -1, -5})
    @DisplayName("validate should fail when DeckCardRequestDto quantity is less than 1")
    void validate_should_failValidation_when_quantityIsLessThanOne(int invalidQuantity) {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(1L);
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(invalidQuantity);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Quantity must be at least 1");
    }

    @ParameterizedTest(name = "Invalid quantity {0}")
    @ValueSource(ints = {4, 5, 10})
    @DisplayName("validate should fail when DeckCardRequestDto quantity exceeds 3")
    void validate_should_failValidation_when_quantityExceedsThree(int invalidQuantity) {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(1L);
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(invalidQuantity);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Quantity cannot exceed 3");
    }

    @Test
    @DisplayName("validate should fail when cardId is null")
    void validate_should_failValidation_when_cardIdIsNull() {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(null);
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(2);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Card ID is required");
    }

    @Test
    @DisplayName("validate should fail when section is null")
    void validate_should_failValidation_when_sectionIsNull() {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(1L);
        cardDto.setSection((DeckSection) null);
        cardDto.setQuantity(2);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Section is required");
    }

    @Test
    @DisplayName("validate should fail when quantity is null")
    void validate_should_failValidation_when_quantityIsNull() {
        DeckCardRequestDto cardDto = new DeckCardRequestDto();
        cardDto.setCardId(1L);
        cardDto.setSection(DeckSection.MAIN);
        cardDto.setQuantity(null);

        Set<ConstraintViolation<DeckCardRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Quantity is required");
    }

    @Test
    @DisplayName("validate should cascade validation to nested DeckCardRequestDto elements")
    void validate_should_cascadeValidation_when_nestedCardIsInvalid() {
        DeckCardRequestDto invalidCardDto = new DeckCardRequestDto();
        invalidCardDto.setCardId(1L);
        invalidCardDto.setSection(DeckSection.MAIN);
        invalidCardDto.setQuantity(5); // Invalid quantity (>3)

        DeckSaveRequestDto deckDto = new DeckSaveRequestDto();
        deckDto.setName("Valid Name");
        deckDto.setFormatName(Format.GOAT);
        deckDto.setDeckCards(List.of(invalidCardDto));

        Set<ConstraintViolation<DeckSaveRequestDto>> violations = validator.validate(deckDto);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().equals("Quantity cannot exceed 3"));
    }
}
