package com.deck.lab.backend.service.generation.tool.dto;

import com.deck.lab.backend.model.CardStatus;

/**
 * Nested info record mapping card name and status.
 */
public record FormatRuleInfo(String cardName, CardStatus status) {
    public FormatRuleInfo(String cardName, String status) {
        this(cardName, status != null ? parseStatus(status) : null);
    }

    private static CardStatus parseStatus(String status) {
        try {
            return CardStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}