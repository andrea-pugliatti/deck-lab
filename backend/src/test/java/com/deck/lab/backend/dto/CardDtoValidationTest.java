package com.deck.lab.backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

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
    @DisplayName("validate should have zero violations for valid CardSaveRequestDto")
    void validate_should_haveNoViolations_when_cardSaveRequestDtoIsValid() {
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
        assertThat(violations).isEmpty();
    }

    @ParameterizedTest(name = "Invalid name \"{0}\" fails validation")
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "\t", "\n"})
    @DisplayName("validate should fail when card name is blank or null")
    void validate_should_failValidation_when_cardNameIsBlankOrNull(String invalidName) {
        CardSaveRequestDto cardDto = new CardSaveRequestDto();
        cardDto.setName(invalidName);
        cardDto.setType(CardType.NORMAL_MONSTER);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Card name is required");
    }

    @Test
    @DisplayName("validate should fail when card type is null")
    void validate_should_failValidation_when_cardTypeIsNull() {
        CardSaveRequestDto cardDto = new CardSaveRequestDto();
        cardDto.setName("Dark Hole");
        cardDto.setType(null);

        Set<ConstraintViolation<CardSaveRequestDto>> violations = validator.validate(cardDto);
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Card type is required");
    }
}
