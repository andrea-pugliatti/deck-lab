package com.deck.lab.backend.validation.rules;

import java.util.Map;
import com.deck.lab.backend.model.Format;

/**
 * Catalog resolving gameplay format deck size limits for the validation engine.
 *
 * <p>
 * <strong>Strategy Factory Design Pattern</strong>
 * </p>
 * <p>
 * This utility acts as a static registry mapping Yu-Gi-Oh! formats (e.g. Goat, Speed Duel, TCG/OCG)
 * to their respective {@link DeckSizeLimits} constraints. It encapsulates the format ruleset lookup
 * strategy, decoupling the rules configuration map from the rule evaluation logic.
 * </p>
 */
public class FormatDeckLimits {

    public static final DeckSizeLimits DEFAULT_LIMITS = new DeckSizeLimits(40, 60, 15, 15);

    private static final Map<Format, DeckSizeLimits> LIMITS_MAP = Map.of(
            Format.TCG,
            DEFAULT_LIMITS,
            Format.OCG,
            DEFAULT_LIMITS,
            Format.EDISON,
            DEFAULT_LIMITS,
            Format.TENGU_PLANT,
            DEFAULT_LIMITS,
            Format.HAT_FORMAT,
            DEFAULT_LIMITS,
            Format.GOAT,
            new DeckSizeLimits(40, 100, 15, 15),
            Format.SPEED_DUEL,
            new DeckSizeLimits(20, 30, 5, 6),
            Format.MASTER_DUEL,
            DEFAULT_LIMITS,
            Format.RUSH_DUEL,
            new DeckSizeLimits(40, 60, 15, 15));

    /**
     * Resolves the capacity bounds for the given format. Defaults to TCG/OCG standard bounds (40-60
     * main, 15 extra, 15 side) if format is null or unspecified.
     *
     * @param format the target game format
     * @return the resolved DeckSizeLimits bounds
     */
    public static DeckSizeLimits getLimits(Format format) {
        if (format == null) {
            return DEFAULT_LIMITS;
        }
        return LIMITS_MAP.getOrDefault(format, DEFAULT_LIMITS);
    }
}
