package com.deck.lab.backend.validation;

public record ValidationError(String message, String property) {
    public ValidationError(String message) {
        this(message, "deckCards");
    }
}
