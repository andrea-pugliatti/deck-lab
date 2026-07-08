package com.deck.lab.backend.validation.rules;

/**
 * Immutable domain model representing capacity limits for the Main, Extra, and
 * Side deck sections.
 *
 * <p>
 * <strong>Value Object Pattern</strong>
 * </p>
 * <p>
 * In domain-driven design, value objects represent descriptive aspects of the
 * domain that have no identity. This record encapsulates the lower and upper
 * bounds for the Main Deck, and maximum sizes for the Extra and Side Decks,
 * ensuring they are treated as a single cohesive constraint group.
 * </p>
 *
 * @param minMainSize  the minimum allowed cards in the main deck section
 * @param maxMainSize  the maximum allowed cards in the main deck section
 * @param maxExtraSize the maximum allowed cards in the extra deck section
 * @param maxSideSize  the maximum allowed cards in the side deck section
 */
public record DeckSizeLimits(
        int minMainSize,
        int maxMainSize,
        int maxExtraSize,
        int maxSideSize) {
}
