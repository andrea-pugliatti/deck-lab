package com.deck.lab.backend.validation.rules;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.validation.DeckRule;
import com.deck.lab.backend.validation.ValidationError;

@Component
public class DeckSizeRule implements DeckRule {
    @Override
    public List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> errors = new ArrayList<>();
        
        if (deck == null || deck.getDeckCards() == null || deck.getDeckCards().isEmpty()) {
            errors.add(new ValidationError("Main Deck must contain between 40 and 60 cards. Current size: 0"));
            return errors;
        }

        int mainSize = 0;
        int extraSize = 0;
        int sideSize = 0;

        for (DeckCard dc : deck.getDeckCards()) {
            String section = dc.getSection() != null ? dc.getSection().toUpperCase().trim() : "";
            int qty = dc.getQuantity() != null ? dc.getQuantity() : 0;
            if (qty <= 0) continue;

            switch (section) {
                case "MAIN" -> mainSize += qty;
                case "EXTRA" -> extraSize += qty;
                case "SIDE" -> sideSize += qty;
            }
        }

        if (mainSize < 40 || mainSize > 60) {
            errors.add(new ValidationError("Main Deck must contain between 40 and 60 cards. Current size: " + mainSize));
        }
        if (extraSize > 15) {
            errors.add(new ValidationError("Extra Deck cannot exceed 15 cards. Current size: " + extraSize));
        }
        if (sideSize > 15) {
            errors.add(new ValidationError("Side Deck cannot exceed 15 cards. Current size: " + sideSize));
        }

        return errors;
    }
}
