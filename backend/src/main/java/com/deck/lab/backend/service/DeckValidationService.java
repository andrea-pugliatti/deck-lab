package com.deck.lab.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.exception.DeckValidationException;
import com.deck.lab.backend.mapper.DeckMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.validation.DeckValidationEngine;
import com.deck.lab.backend.validation.ValidationError;

/**
 * Service coordinating validation checks for user deck lists.
 *
 * <p>
 * <strong>Separation of Concerns (Domain Engine Delegator)</strong>
 * </p>
 * <p>
 * To keep code clean and testable, this service decouples database access from
 * raw business logic evaluation. Instead of embedding validation rules directly
 * in SQL queries or persistent entities, this class is responsible for fetching
 * context data (such as actual card properties from {@link CardRepository} and
 * banlist constraints from {@link FormatRulesRepository}), constructing
 * transient representations, and passing them to the pure, unit-testable
 * {@link DeckValidationEngine}.
 * </p>
 *
 * <p>
 * <strong>JPA Read-Only Optimization:</strong>
 * </p>
 * <ul>
 * <li>{@code @Transactional(readOnly = true)}: Used on retrieval methods to
 * inform the persistence provider (Hibernate) that database modifications are
 * not permitted. This allows Hibernate to optimize performance by disabling
 * dirty-checking mechanisms and bypassing session flushes.</li>
 * </ul>
 */
@Service
public class DeckValidationService {

    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;
    private final DeckMapper deckMapper;
    private final DeckValidationEngine validationEngine;

    public DeckValidationService(CardRepository cardRepository,
            FormatRulesRepository formatRulesRepository,
            DeckMapper deckMapper,
            DeckValidationEngine validationEngine) {
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
        this.deckMapper = deckMapper;
        this.validationEngine = validationEngine;
    }

    /**
     * Validates the structure and legality of a deck based on the provided DeckDto.
     * Fetches card definitions, checks missing IDs, converts references,
     * queries format specific limit lists, and coordinates evaluation of rules.
     *
     * @param deckDto the DTO representing the deck to validate
     * @return a map of database-resolved Card objects mapped by their IDs, for
     *         subsequent save reuse
     * @throws DeckValidationException containing all validation errors if any rules
     *                                 are violated
     */
    @Transactional(readOnly = true)
    public Map<Long, Card> validate(DeckDto deckDto) {
        Map<Long, Card> cardMap = fetchCardMap(deckDto.getDeckCards());
        List<ValidationError> errors = new ArrayList<>();

        // Verify all card IDs exist
        List<DeckCardDto> cardDtos = deckDto.getDeckCards();
        if (cardDtos != null) {
            for (DeckCardDto cardDto : cardDtos) {
                if (cardDto.getCardId() != null && !cardMap.containsKey(cardDto.getCardId())) {
                    errors.add(new ValidationError("Card not found with ID: " + cardDto.getCardId(), "deckCards"));
                }
            }
        }

        // Map DTO to Deck model
        Deck deck = deckMapper.toEntity(deckDto);

        List<DeckCard> deckCards = new ArrayList<>();
        if (cardDtos != null) {
            for (DeckCardDto cardDto : cardDtos) {
                Card card = cardMap.get(cardDto.getCardId());
                if (card != null) {
                    DeckSection sectionEnum = null;
                    try {
                        sectionEnum = cardDto.getSection() != null ? DeckSection.fromString(cardDto.getSection())
                                : null;
                    } catch (IllegalArgumentException e) {
                        // Ignore invalid section
                    }
                    deckCards.add(new DeckCard(deck, card, sectionEnum, cardDto.getQuantity()));
                }
            }
        }
        deck.setDeckCards(deckCards);

        // Fetch format rules if format name is set
        String formatName = deckDto.getFormatName();
        Map<Long, CardStatus> formatLimits = new HashMap<>();
        if (formatName != null && !formatName.isBlank()) {
            try {
                Format format = Format.fromString(formatName);
                List<FormatRules> formatRules = formatRulesRepository.findByFormatName(format);
                for (FormatRules rule : formatRules) {
                    if (rule.getCard() != null) {
                        formatLimits.put(rule.getCard().getId(), rule.getStatus());
                    }
                }
            } catch (IllegalArgumentException e) {
                // Ignore invalid formats
            }
        }

        // Delegate to pure DeckValidationEngine
        List<ValidationError> engineErrors = validationEngine.validate(deck, formatLimits);
        if (engineErrors != null) {
            errors.addAll(engineErrors);
        }

        if (!errors.isEmpty()) {
            throw new DeckValidationException(errors);
        }
        return cardMap;
    }

    /**
     * Resolves and fetches full Card records from database based on DTO card IDs.
     *
     * @param cardDtos list of deck card references
     * @return a map of database resolved Card objects keyed by ID
     */
    public Map<Long, Card> fetchCardMap(List<DeckCardDto> cardDtos) {
        List<Long> cardIds = cardDtos != null
                ? cardDtos.stream()
                        .map(c -> c.getCardId())
                        .filter(Objects::nonNull)
                        .toList()
                : List.of();

        Map<Long, Card> cardMap = new HashMap<>();
        if (!cardIds.isEmpty()) {
            List<Card> cards = cardRepository.findAllById(cardIds);
            for (Card c : cards) {
                cardMap.put(c.getId(), c);
            }
        }
        return cardMap;
    }
}
