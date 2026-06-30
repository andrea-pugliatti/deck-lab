package com.deck.lab.backend.validation.rules;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Deck list construction rule enforcing the universal copy limit (Rule of
 * Three) for cards.
 *
 * <p>
 * <strong>Concrete Rule Strategy (Quantity Threshold Check)</strong>
 * </p>
 * <p>
 * Annotated with {@link Component} for discovery by the validation engine.
 * Under standard Yu-Gi-Oh! deck construction rules, a player cannot include
 * more than 3 copies of a single card across the entire deck (Main, Extra, and
 * Side lists combined), regardless of format banlist specifics. This class
 * builds a summary card frequency map to assert this limitation.
 * </p>
 */
@Component
public class QuantityLimitRule implements DeckRule {

    /**
     * Evaluates copy limits across the deck's card list.
     */
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();
        if (deck == null || deck.getDeckCards() == null) {
            return errors;
        }

        Map<Long, Integer> cardQuantities = new HashMap<>();
        Map<Long, String> cardNames = new HashMap<>();

        for (DeckCard dc : deck.getDeckCards()) {
            if (dc.getCard() == null || dc.getCard().getId() == null) {
                continue;
            }
            Long cardId = dc.getCard().getId();
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0)
                continue;

            cardQuantities.put(cardId, cardQuantities.getOrDefault(cardId, 0) + qty);
            cardNames.put(cardId, dc.getCard().getName());
        }

        for (Map.Entry<Long, Integer> entry : cardQuantities.entrySet()) {
            Long cardId = entry.getKey();
            int totalQty = entry.getValue();
            if (totalQty > 3) {
                String cardName = cardNames.getOrDefault(cardId, "Unknown Card");
                errors.add(new ValidationError("Card '" + cardName
                        + "' exceeds the limit of 3 copies across the entire deck. Total copies: " + totalQty));
            }
        }

        return errors;
    }
}
