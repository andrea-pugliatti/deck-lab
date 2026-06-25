package com.deck.lab.backend.validation.rules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;

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
            if (card == null)
                continue;

            DeckSection section = dc.getSection();
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0)
                continue;

            boolean extraType = isExtraDeckCard(card);
            if (section == DeckSection.MAIN) {
                if (extraType) {
                    errors.add(new ValidationError(
                            "Extra Deck monster '" + card.getName() + "' must be placed in the EXTRA section."));
                }
            } else if (section == DeckSection.EXTRA) {
                if (!extraType) {
                    errors.add(new ValidationError(
                            "Main Deck card '" + card.getName() + "' cannot be placed in the EXTRA section."));
                }
            } else if (section != DeckSection.SIDE) {
                errors.add(new ValidationError("Invalid section: " + dc.getSection()));
            }
        }

        return errors;
    }

    private boolean isExtraDeckCard(Card card) {
        if (card == null || card.getType() == null) {
            return false;
        }
        return card.getType().isExtraDeck();
    }
}
