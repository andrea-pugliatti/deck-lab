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

/**
 * Deck list construction rule validating that cards are housed in the correct physical sections of
 * the deck list.
 *
 * <p>
 * <strong>Concrete Rule Strategy (Constraint Placement Check)</strong>
 * </p>
 * <p>
 * Annotated with {@link Component} for autowired detection. In Yu-Gi-Oh!, card classification types
 * govern physical placement. For instance, Extra Deck monsters (Fusion, Synchro, Xyz, Link) cannot
 * be shuffled into the Main Deck. Conversely, Main Deck cards (Spell, Trap, Normal/Effect monsters)
 * must not reside in the Extra Deck. This strategy inspects each card slot's classification type
 * and flags misplaced cards.
 * </p>
 */
@Component
public class CardPlacementRule implements DeckRule {

    /**
     * Verifies that each card is placed in its valid section (Main/Extra/Side).
     */
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
            int qty = dc.getQuantity() != null
                    ? dc.getQuantity()
                    : 0;
            if (qty <= 0)
                continue;

            boolean extraType = isExtraDeckCard(card);
            if (section == DeckSection.MAIN) {
                if (extraType) {
                    errors.add(new ValidationError("Extra Deck monster '" + card.getName()
                            + "' must be placed in the EXTRA section."));
                }
            } else if (section == DeckSection.EXTRA) {
                if (!extraType) {
                    errors.add(new ValidationError("Main Deck card '" + card.getName()
                            + "' cannot be placed in the EXTRA section."));
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
