package com.deck.lab.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.mapper.DeckMapper;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.deck.lab.backend.repository.specification.DeckSpecification;

import java.util.*;

@Service
public class DeckService {

    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final DeckMapper deckMapper;

    public DeckService(DeckRepository deckRepository,
            CardRepository cardRepository,
            FormatRulesRepository formatRulesRepository,
            DeckMapper deckMapper) {
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
        this.deckMapper = deckMapper;
    }

    public List<DeckDto> findAllWithFilters(String name, String format, String username) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and(DeckSpecification.hasName(name))
                .and(DeckSpecification.hasFormat(format))
                .and(DeckSpecification.hasUser(username));

        List<Deck> decks = deckRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<DeckDto> dtos = new ArrayList<>();
        for (Deck deck : decks) {
            dtos.add(deckMapper.toDto(deck));
        }
        return dtos;
    }

    public DeckDto getDeckById(Long id) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and((root, query, builder) -> builder.equal(root.get("id"), id));
        Deck deck = deckRepository.findOne(spec)
                .orElseThrow(() -> new NoSuchElementException("Deck not found"));
        return deckMapper.toDto(deck);
    }

    @Transactional
    public DeckDto createDeck(DeckDto deckDto, User user) {
        Deck deck = new Deck();
        deck.setName(deckDto.getName());
        deck.setDescription(deckDto.getDescription());
        deck.setFormatName(deckDto.getFormatName());
        deck.setUser(user);

        saveDeckCards(deck, deckDto.getDeckCards());

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    @Transactional
    public DeckDto updateDeck(Long id, DeckDto deckDto, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Deck not found or unauthorized"));

        deck.setName(deckDto.getName());
        deck.setDescription(deckDto.getDescription());
        deck.setFormatName(deckDto.getFormatName());

        saveDeckCards(deck, deckDto.getDeckCards());

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    private void saveDeckCards(Deck deck, List<DeckCardDto> cardDtos) {
        List<DeckCard> newDeckCards = new ArrayList<>();
        if (cardDtos != null && !cardDtos.isEmpty()) {
            List<Long> cardIds = cardDtos.stream().map(DeckCardDto::getCardId).toList();
            List<Card> cards = cardRepository.findAllById(cardIds);
            Map<Long, Card> cardMap = new HashMap<>();
            for (Card c : cards) {
                cardMap.put(c.getId(), c);
            }
            for (DeckCardDto cardDto : cardDtos) {
                Card card = cardMap.get(cardDto.getCardId());
                if (card == null) {
                    throw new IllegalArgumentException("Card not found with ID: " + cardDto.getCardId());
                }
                newDeckCards.add(new DeckCard(deck, card, cardDto.getSection().toUpperCase(), cardDto.getQuantity()));
            }
        }

        deck.getDeckCards().clear();
        deck.getDeckCards().addAll(newDeckCards);
    }

    @Transactional
    public void deleteDeck(Long id, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Deck not found or unauthorized"));
        deckRepository.delete(deck);
    }
}