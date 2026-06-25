package com.deck.lab.backend.exception;

import com.deck.lab.backend.validation.ValidationError;
import java.util.List;

public class DeckValidationException extends RuntimeException {
    private final List<ValidationError> errors;

    public DeckValidationException(List<ValidationError> errors) {
        super("Deck validation failed");
        this.errors = errors != null ? errors : List.of();
    }

    public List<ValidationError> getErrors() {
        return errors;
    }
}
