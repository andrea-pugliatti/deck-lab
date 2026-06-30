package com.deck.lab.backend.model;

/**
 * Enum defining a card's banlist limitation status within a specific format.
 *
 * <p>
 * <strong>Game Rules Context:</strong>
 * </p>
 * <ul>
 * <li>{@code FORBIDDEN}: The card is banned. 0 copies are allowed in any deck
 * list section.</li>
 * <li>{@code LIMITED}: The card is restricted. At most 1 copy is allowed in the
 * entire deck list (Main, Extra, and Side combined).</li>
 * <li>{@code SEMI_LIMITED}: The card is partially restricted. At most 2 copies
 * are allowed in the entire deck list.</li>
 * </ul>
 */
public enum CardStatus {
    FORBIDDEN,
    LIMITED,
    SEMI_LIMITED
}
