package com.deck.lab.backend.exception;

import java.util.List;

import com.deck.lab.backend.validation.ValidationError;

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
