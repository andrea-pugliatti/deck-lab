package com.deck.lab.backend.validation.rules;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class FormatLegalityRule implements DeckRule {
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();
        if (deck == null || deck.getDeckCards() == null || formatLimits == null || formatLimits.isEmpty()) {
            return errors;
        }

        String formatName = deck.getFormatName();
        if (formatName == null || formatName.isBlank()) {
            return errors;
        }

        Map<Long, Integer> cardQuantities = new HashMap<>();
        Map<Long, Card> cards = new HashMap<>();

        for (DeckCard dc : deck.getDeckCards()) {
            if (dc.getCard() == null || dc.getCard().getId() == null) {
                continue;
            }
            Long cardId = dc.getCard().getId();
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0) continue;

            cardQuantities.put(cardId, cardQuantities.getOrDefault(cardId, 0) + qty);
            cards.put(cardId, dc.getCard());
        }

        for (Map.Entry<Long, Integer> entry : cardQuantities.entrySet()) {
            Long cardId = entry.getKey();
            int totalQty = entry.getValue();

            CardStatus status = formatLimits.get(cardId);
            if (status != null) {
                int limit = switch (status) {
                    case FORBIDDEN -> 0;
                    case LIMITED -> 1;
                    case SEMI_LIMITED -> 2;
                };
                if (totalQty > limit) {
                    Card card = cards.get(cardId);
                    String cardName = card != null ? card.getName() : "Unknown Card";
                    String statusLabel = status.name().toLowerCase().replace('_', '-');
                    errors.add(new ValidationError("Card '" + cardName + "' is " + statusLabel + " in format '" + formatName
                            + "' (max " + limit + " copies allowed, found " + totalQty + ")"));
                }
            }
        }

        return errors;
    }
}
