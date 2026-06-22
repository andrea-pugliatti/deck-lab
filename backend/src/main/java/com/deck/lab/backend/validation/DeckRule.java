package com.deck.lab.backend.validation;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import java.util.List;
import java.util.Map;

public interface DeckRule {
    List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits);
}
