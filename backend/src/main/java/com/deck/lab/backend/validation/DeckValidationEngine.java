package com.deck.lab.backend.validation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.validation.rules.CardPlacementRule;
import com.deck.lab.backend.validation.rules.DeckSizeRule;
import com.deck.lab.backend.validation.rules.FormatLegalityRule;
import com.deck.lab.backend.validation.rules.QuantityLimitRule;

@Component
public class DeckValidationEngine {
    private final List<DeckRule> rules;

    @Autowired
    public DeckValidationEngine(List<DeckRule> rules) {
        this.rules = rules != null ? Collections.unmodifiableList(new ArrayList<>(rules)) : Collections.emptyList();
    }

    public DeckValidationEngine() {
        List<DeckRule> defaultRules = new ArrayList<>();
        defaultRules.add(new DeckSizeRule());
        defaultRules.add(new QuantityLimitRule());
        defaultRules.add(new CardPlacementRule());
        defaultRules.add(new FormatLegalityRule());
        this.rules = Collections.unmodifiableList(defaultRules);
    }

    public List<ValidationError> validate(Deck deck, Map<Long, CardStatus> formatLimits) {
        List<ValidationError> allErrors = new ArrayList<>();

        for (DeckRule rule : rules) {
            List<ValidationError> errors = rule.evaluate(deck, formatLimits);
            if (errors != null) {
                allErrors.addAll(errors);
            }
        }

        return allErrors;
    }
}
