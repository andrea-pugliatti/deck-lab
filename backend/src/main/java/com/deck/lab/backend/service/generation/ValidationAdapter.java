package com.deck.lab.backend.service.generation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.validation.DeckValidationEngine;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Adapter integrating format rules extraction and DeckValidationEngine logic.
 */
@Service
public class ValidationAdapter {

    private final FormatRulesRepository formatRulesRepository;
    private final DeckValidationEngine validationEngine;

    public ValidationAdapter(FormatRulesRepository formatRulesRepository, DeckValidationEngine validationEngine) {
        this.formatRulesRepository = formatRulesRepository;
        this.validationEngine = validationEngine;
    }

    /**
     * Extracts card status limits based on the deck's format and runs validation
     * rules.
     *
     * @param deck transient deck entity
     * @return a list of human-readable rule validation warnings
     */
    public List<String> validate(Deck deck) {
        Map<Long, CardStatus> formatLimits = new HashMap<>();
        Format format = deck.getFormatName();

        if (format != null) {
            List<FormatRules> formatRules = formatRulesRepository.findByFormatName(format);
            for (FormatRules rule : formatRules) {
                if (rule.getCard() != null) {
                    formatLimits.put(rule.getCard().getId(), rule.getStatus());
                }
            }
        }

        List<ValidationError> errors = validationEngine.validate(deck, formatLimits);
        return errors.stream()
                .map(error -> error.message())
                .collect(Collectors.toList());
    }
}
