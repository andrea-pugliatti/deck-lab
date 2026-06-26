package com.deck.lab.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.specification.CardSpecification;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<String> findDistinctAttributes() {
        return Stream.of(CardAttribute.values())
                .map(cardAttribute -> cardAttribute.getValue())
                .sorted()
                .toList();
    }

    public List<String> findDistinctRaces() {
        return Stream.of(CardRace.values())
                .map(cardRace -> cardRace.getValue())
                .sorted()
                .toList();
    }

    public List<String> findDistinctArchetypes() {
        return cardRepository.findDistinctByArchetypeNotNullAndArchetypeNot("").stream()
                .map(card -> card.getArchetype())
                .filter(a -> a != null && !a.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    public List<String> findDistinctTypes() {
        return Stream.of(CardType.values())
                .map(cardType -> cardType.getValue())
                .sorted()
                .toList();
    }

    public Page<Card> findAllOrWithFilters(String name, String type, String attribute, String race, String archetype,
            Pageable pageable) {
        Specification<Card> spec = Specification.where(
                CardSpecification.hasName(name))
                .and(CardSpecification.hasType(type))
                .and(CardSpecification.hasAttribute(attribute))
                .and(CardSpecification.hasRace(race))
                .and(CardSpecification.hasArchetype(archetype));
        return cardRepository.findAll(spec, pageable);
    }

    public Optional<Card> findById(Long id) {
        return cardRepository.findById(id);
    }

    public Boolean existsById(Long id) {
        return cardRepository.existsById(id);
    }

    public Card getById(Long id) {
        return findById(id).orElseThrow(() -> new ResourceNotFoundException("Card not found with id: " + id));
    }

    public Card save(Card card) {
        return cardRepository.save(card);
    }

    public Card edit(Card card) {
        return cardRepository.save(card);
    }

    public void deleteById(Long id) {
        if (cardRepository.existsById(id)) {
            cardRepository.deleteById(id);
        }
    }
}
