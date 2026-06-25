package com.deck.lab.backend.validation;

import java.util.List;
import java.util.Map;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;

public interface DeckRule {
    List<ValidationError> evaluate(Deck deck, Map<Long, CardStatus> formatLimits);
}
