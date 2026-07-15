package com.deck.lab.backend.validation;

import java.util.List;
import java.util.Map;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;

/**
 * Interface defining the execution contract for individual decklist validation rules.
 *
 * <p>
 * <strong>Strategy Interface / Contract-Based Programming</strong>
 * </p>
 * <p>
 * In clean code architectures, interfaces serve as contracts. By requiring all validation checks to
 * implement this interface, we ensure they expose an identical signature: accepting a {@link Deck}
 * configuration and a map of format banlist limits ({@link CardStatus}), and returning a collection
 * of detected {@link ValidationError} logs.
 * </p>
 *
 * <p>
 * This abstraction allows the core engine to execute validations dynamically without needing to
 * know the specific inner workings of each concrete rule class.
 * </p>
 */
public interface DeckRule {

    /**
     * Evaluates a deck list against specific format constraints.
     *
     * @param deck         the Deck entity list to evaluate
     * @param formatLimits database mapped limitations (forbidden, limited, semi-limited status) for
     *                         cards
     * @return a list of ValidationErrors if the rule is violated, or an empty list if valid
     */
    List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits);
}
