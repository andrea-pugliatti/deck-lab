package com.deck.lab.backend.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

import java.util.*;

@Component
public class DeckDtoValidator implements ConstraintValidator<ValidDeck, DeckDto> {

    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;

    public DeckDtoValidator(CardRepository cardRepository, FormatRulesRepository formatRulesRepository) {
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
    }

    @Override
    public boolean isValid(DeckDto deckDto, ConstraintValidatorContext context) {
        if (deckDto == null) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        boolean isValid = true;

        List<DeckCardDto> cardDtos = deckDto.getDeckCards();
        if (cardDtos == null || cardDtos.isEmpty()) {
            // Check size of empty deck (Main deck must be 40-60, which 0 is not)
            context.buildConstraintViolationWithTemplate(
                    "Main Deck must contain between 40 and 60 cards. Current size: 0")
                    .addPropertyNode("deckCards")
                    .addConstraintViolation();
            return false;
        }

        // Fetch all cards by IDs to map card properties (type) securely
        List<Long> cardIds = cardDtos.stream()
                .map(DeckCardDto::getCardId)
                .filter(Objects::nonNull)
                .toList();

        Map<Long, Card> cardMap = new HashMap<>();
        if (!cardIds.isEmpty()) {
            List<Card> cards = cardRepository.findAllById(cardIds);
            for (Card c : cards) {
                cardMap.put(c.getId(), c);
            }
        }

        // Verify all card IDs exist
        for (DeckCardDto cardDto : cardDtos) {
            if (cardDto.getCardId() != null && !cardMap.containsKey(cardDto.getCardId())) {
                context.buildConstraintViolationWithTemplate("Card not found with ID: " + cardDto.getCardId())
                        .addPropertyNode("deckCards")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        if (!isValid) {
            return false;
        }

        // Initialize calculations
        Map<Long, Integer> cardQuantities = new HashMap<>();
        int mainDeckSize = 0;
        int extraDeckSize = 0;
        int sideDeckSize = 0;

        for (DeckCardDto cardDto : cardDtos) {
            Long cardId = cardDto.getCardId();
            if (cardId == null) {
                continue;
            }
            Card card = cardMap.get(cardId);
            String section = cardDto.getSection() != null ? cardDto.getSection().toUpperCase().trim() : "";
            int qty = cardDto.getQuantity() != null ? cardDto.getQuantity() : 0;

            if (qty <= 0) {
                continue;
            }

            cardQuantities.put(cardId, cardQuantities.getOrDefault(cardId, 0) + qty);

            // Verify section placement correctness
            boolean extraType = isExtraDeckCard(card);
            if ("MAIN".equals(section)) {
                mainDeckSize += qty;
                if (extraType) {
                    context.buildConstraintViolationWithTemplate(
                            "Extra Deck monster '" + card.getName() + "' must be placed in the EXTRA section.")
                            .addPropertyNode("deckCards")
                            .addConstraintViolation();
                    isValid = false;
                }
            } else if ("EXTRA".equals(section)) {
                extraDeckSize += qty;
                if (!extraType) {
                    context.buildConstraintViolationWithTemplate(
                            "Main Deck card '" + card.getName() + "' cannot be placed in the EXTRA section.")
                            .addPropertyNode("deckCards")
                            .addConstraintViolation();
                    isValid = false;
                }
            } else if ("SIDE".equals(section)) {
                sideDeckSize += qty;
            } else {
                context.buildConstraintViolationWithTemplate("Invalid section: " + cardDto.getSection())
                        .addPropertyNode("deckCards")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        // Verify deck limits
        if (mainDeckSize < 40 || mainDeckSize > 60) {
            context.buildConstraintViolationWithTemplate(
                    "Main Deck must contain between 40 and 60 cards. Current size: " + mainDeckSize)
                    .addPropertyNode("deckCards")
                    .addConstraintViolation();
            isValid = false;
        }

        if (extraDeckSize > 15) {
            context.buildConstraintViolationWithTemplate(
                    "Extra Deck cannot exceed 15 cards. Current size: " + extraDeckSize)
                    .addPropertyNode("deckCards")
                    .addConstraintViolation();
            isValid = false;
        }

        if (sideDeckSize > 15) {
            context.buildConstraintViolationWithTemplate(
                    "Side Deck cannot exceed 15 cards. Current size: " + sideDeckSize)
                    .addPropertyNode("deckCards")
                    .addConstraintViolation();
            isValid = false;
        }

        // Verify general limit of 3 copies per card
        for (Map.Entry<Long, Integer> entry : cardQuantities.entrySet()) {
            Long cardId = entry.getKey();
            int totalQty = entry.getValue();
            Card card = cardMap.get(cardId);
            if (totalQty > 3) {
                context.buildConstraintViolationWithTemplate("Card '" + card.getName()
                        + "' exceeds the limit of 3 copies across the entire deck. Total copies: " + totalQty)
                        .addPropertyNode("deckCards")
                        .addConstraintViolation();
                isValid = false;
            }
        }

        // Verify format rules if a format name is provided
        String formatName = deckDto.getFormatName();
        if (formatName != null && !formatName.isBlank()) {
            List<FormatRules> formatRules = formatRulesRepository.findByFormatName(formatName);
            Map<Long, CardStatus> formatLimits = new HashMap<>();
            for (FormatRules rule : formatRules) {
                if (rule.getCard() != null) {
                    formatLimits.put(rule.getCard().getId(), rule.getStatus());
                }
            }

            for (Map.Entry<Long, Integer> entry : cardQuantities.entrySet()) {
                Long cardId = entry.getKey();
                int totalQty = entry.getValue();
                Card card = cardMap.get(cardId);

                CardStatus status = formatLimits.get(cardId);
                if (status != null) {
                    int limit = switch (status) {
                        case FORBIDDEN -> 0;
                        case LIMITED -> 1;
                        case SEMI_LIMITED -> 2;
                    };
                    if (totalQty > limit) {
                        String statusLabel = status.name().toLowerCase().replace('_', '-');
                        context.buildConstraintViolationWithTemplate(
                                "Card '" + card.getName() + "' is " + statusLabel + " in format '" + formatName
                                        + "' (max " + limit + " copies allowed, found " + totalQty + ")")
                                .addPropertyNode("deckCards")
                                .addConstraintViolation();
                        isValid = false;
                    }
                }
            }
        }

        return isValid;
    }

    private boolean isExtraDeckCard(Card card) {
        if (card == null || card.getType() == null) {
            return false;
        }
        String type = card.getType().toLowerCase();
        return type.contains("fusion") || type.contains("synchro") || type.contains("xyz") || type.contains("link");
    }
}
