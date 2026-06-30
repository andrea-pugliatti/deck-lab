package com.deck.lab.backend.validation.rules;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Deck list construction rule enforcing format banlist compliance restrictions.
 *
 * <p>
 * <strong>Concrete Rule Strategy (Banlist Verification Strategy)</strong>
 * </p>
 * <p>
 * Annotated with {@link stereotype.Component} for autowired loading. This
 * strategy evaluates card counts against the database-configured banlist
 * definitions for a chosen format:
 * <ul>
 * <li>{@link CardStatus#FORBIDDEN}: Enforces that the total card count across
 * all sections (Main, Extra, Side) must be exactly 0.</li>
 * <li>{@link CardStatus#LIMITED}: Enforces that the total count must not exceed
 * 1.</li>
 * <li>{@link CardStatus#SEMI_LIMITED}: Enforces that the total count must not
 * exceed 2.</li>
 * </ul>
 * Any excess cards are logged as validation errors.
 * </p>
 */
@Component
public class FormatLegalityRule implements DeckRule {

    /**
     * Evaluates card quantities against target format limits.
     */
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();
        if (deck == null || deck.getDeckCards() == null || formatLimits == null || formatLimits.isEmpty()) {
            return errors;
        }

        Format format = deck.getFormatName();
        if (format == null) {
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
            if (qty <= 0)
                continue;

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
                    errors.add(new ValidationError(
                            "Card '" + cardName + "' is " + statusLabel + " in format '" + format.getValue()
                                    + "' (max " + limit + " copies allowed, found " + totalQty + ")"));
                }
            }
        }

        return errors;
    }
}
