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

    @Transactional(readOnly = true)
    public void validateDeck(DeckDto deckDto) {
        Map<Long, Card> cardMap = fetchCardMap(deckDto.getDeckCards());
        validateDeckInternal(deckDto, cardMap);
    }

    @Transactional(readOnly = true)
    public Map<Long, Card> validateAndGetCardMap(DeckDto deckDto) {
        Map<Long, Card> cardMap = fetchCardMap(deckDto.getDeckCards());
        validateDeckInternal(deckDto, cardMap);
        return cardMap;
    }

    public Map<Long, Card> fetchCardMap(List<DeckCardDto> cardDtos) {
        List<Long> cardIds = cardDtos != null ? cardDtos.stream()
                .map(DeckCardDto::getCardId)
                .filter(Objects::nonNull)
                .toList() : List.of();

        Map<Long, Card> cardMap = new HashMap<>();
        if (!cardIds.isEmpty()) {
            List<Card> cards = cardRepository.findAllById(cardIds);
            for (Card c : cards) {
                cardMap.put(c.getId(), c);
            }
        }
        return cardMap;
    }

    private void validateDeckInternal(DeckDto deckDto, Map<Long, Card> cardMap) {
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
    }
}
