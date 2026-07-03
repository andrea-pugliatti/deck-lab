package com.deck.lab.backend.validation.rules;

/**
 * Bounds representing valid sizes for Main, Extra, and Side deck sections.
 */
public record DeckSizeLimits(
    int minMainSize,
    int maxMainSize,
    int maxExtraSize,
    int maxSideSize
) {}
