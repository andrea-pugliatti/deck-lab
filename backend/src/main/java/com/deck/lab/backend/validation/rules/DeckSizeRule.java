package com.deck.lab.backend.validation.rules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Deck list construction rule enforcing deck section capacity bounds.
 *
 * <p>
 * <strong>Concrete Rule Strategy (Quantity Auditing)</strong>
 * </p>
 * <p>
 * Annotated with {@link Component} so that it registers automatically into the
 * Spring container. This class evaluates the cumulative quantity of cards
 * located in each of the three card boundaries (Main Deck, Extra Deck, and Side
 * Deck) based on the format-specific constraints.
 * </p>
 */
@Component
public class DeckSizeRule implements DeckRule {

    /**
     * Evaluates section limits (Main, Extra, Side) of the deck.
     */
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();

        Format format = deck != null ? deck.getFormatName() : null;
        DeckSizeLimits limits = FormatDeckLimits.getLimits(format);

        if (deck == null || deck.getDeckCards() == null || deck.getDeckCards().isEmpty()) {
            errors.add(new ValidationError("Main Deck must contain between " + limits.minMainSize() + " and " + limits.maxMainSize() + " cards. Current size: 0"));
            return errors;
        }

        int mainSize = 0;
        int extraSize = 0;
        int sideSize = 0;

        for (DeckCard dc : deck.getDeckCards()) {
            DeckSection section = dc.getSection();
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0)
                continue;

            switch (section) {
                case DeckSection.MAIN -> mainSize += qty;
                case DeckSection.EXTRA -> extraSize += qty;
                case DeckSection.SIDE -> sideSize += qty;
            }
        }

        if (mainSize < limits.minMainSize() || mainSize > limits.maxMainSize()) {
            errors.add(
                    new ValidationError("Main Deck must contain between " + limits.minMainSize() + " and " + limits.maxMainSize() + " cards. Current size: " + mainSize));
        }
        if (extraSize > limits.maxExtraSize()) {
            errors.add(new ValidationError("Extra Deck cannot exceed " + limits.maxExtraSize() + " cards. Current size: " + extraSize));
        }
        if (sideSize > limits.maxSideSize()) {
            errors.add(new ValidationError("Side Deck cannot exceed " + limits.maxSideSize() + " cards. Current size: " + sideSize));
        }

        return errors;
    }
}
