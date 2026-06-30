package com.deck.lab.backend.validation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.validation.rules.CardPlacementRule;
import com.deck.lab.backend.validation.rules.DeckSizeRule;
import com.deck.lab.backend.validation.rules.FormatLegalityRule;
import com.deck.lab.backend.validation.rules.QuantityLimitRule;

/**
 * Core validation engine orchestrating the evaluation of deck list construction
 * rules.
 *
 * <p>
 * <strong>Strategy Pattern & Open-Closed Principle (Composite Rules
 * Engine)</strong>
 * </p>
 * <p>
 * This engine acts as a coordinator executing multiple decoupled checks. Rather
 * than hardcoding validation rules in a long nested sequence of conditionals,
 * the engine relies on the <b>Strategy Pattern</b>. It defines a unified
 * interface {@link DeckRule}. Each concrete validation rule (e.g.
 * {@link DeckSizeRule}, {@link QuantityLimitRule}) is a separate strategy
 * class.
 * </p>
 *
 * <p>
 * By doing this, the system adheres to the <b>Open-Closed Principle (OCP)</b>:
 * the engine is closed for modification but open for expansion. If game rules
 * require adding a new restriction in the future, we can simply implement a new
 * {@link DeckRule} component without touching this class.
 * </p>
 *
 * <p>
 * <strong>Spring List Autowiring:</strong>
 * </p>
 * <p>
 * The primary constructor accepts a {@code List<DeckRule>}. Spring's IoC
 * container automatically detects all registered beans in the classpath that
 * implement the {@link DeckRule} interface and gathers them into this injected
 * list. This provides automatic registration of new rules with zero manual
 * wiring configuration.
 * </p>
 */
@Component
public class DeckValidationEngine {
    private final List<DeckRule> rules;

    public DeckValidationEngine(List<DeckRule> rules) {
        this.rules = rules != null ? Collections.unmodifiableList(new ArrayList<>(rules)) : Collections.emptyList();
    }

    /**
     * Default constructor instantiating concrete rule checks manually.
     * Used primarily for unit tests where Spring context is not loaded.
     */
    public DeckValidationEngine() {
        List<DeckRule> defaultRules = new ArrayList<>();
        defaultRules.add(new DeckSizeRule());
        defaultRules.add(new QuantityLimitRule());
        defaultRules.add(new CardPlacementRule());
        defaultRules.add(new FormatLegalityRule());
        this.rules = Collections.unmodifiableList(defaultRules);
    }

    /**
     * Evaluates a deck against all configured rule checks.
     *
     * @param deck         the Deck entity list to evaluate
     * @param formatLimits database mapped limitations for format cards
     * @return a list containing all accumulated validation errors, or empty if
     *         valid
     */
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
