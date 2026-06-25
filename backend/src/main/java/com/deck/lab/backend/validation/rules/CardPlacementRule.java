package com.deck.lab.backend.validation.rules;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class CardPlacementRule implements DeckRule {
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();
        if (deck == null || deck.getDeckCards() == null) {
            return errors;
        }

        for (DeckCard dc : deck.getDeckCards()) {
            Card card = dc.getCard();
            if (card == null) continue;

            String section = dc.getSection() != null ? dc.getSection().toUpperCase().trim() : "";
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0) continue;

            boolean extraType = isExtraDeckCard(card);
            if ("MAIN".equals(section)) {
                if (extraType) {
                    errors.add(new ValidationError("Extra Deck monster '" + card.getName() + "' must be placed in the EXTRA section."));
                }
            } else if ("EXTRA".equals(section)) {
                if (!extraType) {
                    errors.add(new ValidationError("Main Deck card '" + card.getName() + "' cannot be placed in the EXTRA section."));
                }
            } else if (!"SIDE".equals(section)) {
                errors.add(new ValidationError("Invalid section: " + dc.getSection()));
            }
        }

        return errors;
    }

    private boolean isExtraDeckCard(Card card) {
        if (card == null || card.getType() == null) {
            return false;
        }
        String type = card.getType().toLowerCase();
        return type.contains("fusion") || type.contains("synchro") || type.contains("xyz") || type.contains("link");
    }
}
