package com.deck.lab.backend.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.validation.DeckValidationEngine;
import com.deck.lab.backend.validation.ValidationError;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;

import java.util.*;

@Component
public class DeckDtoValidator implements ConstraintValidator<ValidDeck, DeckDto> {

    private final CardRepository cardRepository;
    private final FormatRulesRepository formatRulesRepository;
    private final DeckValidationEngine validationEngine;

    public DeckDtoValidator(CardRepository cardRepository, FormatRulesRepository formatRulesRepository) {
        this.cardRepository = cardRepository;
        this.formatRulesRepository = formatRulesRepository;
        this.validationEngine = new DeckValidationEngine();
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

        // Map DTO to transient domain model Deck
        Deck deck = new Deck();
        deck.setName(deckDto.getName());
        deck.setDescription(deckDto.getDescription());
        deck.setFormatName(deckDto.getFormatName());
        
        List<DeckCard> deckCards = new ArrayList<>();
        for (DeckCardDto cardDto : cardDtos) {
            Card card = cardMap.get(cardDto.getCardId());
            if (card != null) {
                deckCards.add(new DeckCard(deck, card, cardDto.getSection(), cardDto.getQuantity()));
            }
        }
        deck.setDeckCards(deckCards);

        // Fetch format rules if format name is set
        String formatName = deckDto.getFormatName();
        Map<Long, CardStatus> formatLimits = new HashMap<>();
        if (formatName != null && !formatName.isBlank()) {
            List<FormatRules> formatRules = formatRulesRepository.findByFormatName(formatName);
            for (FormatRules rule : formatRules) {
                if (rule.getCard() != null) {
                    formatLimits.put(rule.getCard().getId(), rule.getStatus());
                }
            }
        }

        // Delegate to pure DeckValidationEngine passing limits map directly
        List<ValidationError> errors = validationEngine.validate(deck, formatLimits);

        if (!errors.isEmpty()) {
            for (ValidationError error : errors) {
                context.buildConstraintViolationWithTemplate(error.message())
                        .addPropertyNode(error.property())
                        .addConstraintViolation();
            }
            return false;
        }

        return true;
    }
}
