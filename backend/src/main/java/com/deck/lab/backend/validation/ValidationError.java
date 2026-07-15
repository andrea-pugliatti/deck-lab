package com.deck.lab.backend.validation;

/**
 * Immutable data carrier representing a single decklist validation rule violation.
 *
 * <p>
 * <strong>Java Record (Stateless Data Carrier)</strong>
 * </p>
 * <p>
 * Introduced as a standard feature in Java 16, a <strong>Record</strong> is a special class type
 * designed to hold immutable data. The compiler automatically generates the constructor, private
 * final fields, accessor methods (e.g. {@code message()} and {@code property()}), and standard
 * Object implementations ({@code equals()}, {@code hashCode()}, {@code toString()}), eliminating
 * boilerplate code.
 * </p>
 *
 * <p>
 * <strong>Validation Engine Integration:</strong>
 * </p>
 * <p>
 * Each validation rule ({@link DeckRule}) evaluates deck structures and returns a list of
 * {@code ValidationError} entries. These entries log a descriptive warning ({@code message}) and
 * target the specific deck property ({@code property}, defaulting to "deckCards") that caused the
 * violation, allowing frontend clients to identify invalid slots.
 * </p>
 */
public record ValidationError(String message, String property) {
    public ValidationError(String message) {
        this(message, "deckCards");
    }
}
