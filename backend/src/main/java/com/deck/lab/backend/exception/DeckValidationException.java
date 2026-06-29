package com.deck.lab.backend.exception;

import java.util.List;

import com.deck.lab.backend.validation.ValidationError;

/**
 * Custom runtime exception thrown when a deck list violates structural or
 * format validation rules.
 * 
 * <p>
 * <b>Encapsulating Multiple Errors:</b>
 * Standard exceptions only support a single text message. Because deck
 * validation can fail for multiple reasons at once (e.g., deck has 39 cards AND
 * contains forbidden cards), this class extends {@link RuntimeException} to
 * encapsulate a collection of {@link ValidationError} objects, allowing the API
 * to return a detailed array of all validation failures in a single response
 * payload.
 * </p>
 */
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
