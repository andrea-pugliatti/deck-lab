package com.deck.lab.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.DeckCardDto;
import com.deck.lab.backend.dto.DeckDto;
import com.deck.lab.backend.mapper.DeckCardMapper;
import com.deck.lab.backend.mapper.DeckMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.specification.DeckSpecification;

@Service
public class DeckService {
    private final DeckRepository deckRepository;
    private final DeckMapper deckMapper;
    private final DeckCardMapper deckCardMapper;
    private final DeckValidationService deckValidationService;

    public DeckService(DeckRepository deckRepository,
            DeckMapper deckMapper,
            DeckCardMapper deckCardMapper,
            DeckValidationService deckValidationService) {
        this.deckRepository = deckRepository;
        this.deckMapper = deckMapper;
        this.deckCardMapper = deckCardMapper;
        this.deckValidationService = deckValidationService;
    }

    public List<String> findDistinctFormats() {
        return Stream.of(Format.values())
                .map(format -> format.getValue())
                .sorted()
                .toList();
    }

    public List<DeckDto> findAllWithFilters(String name, String format, String username) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and(DeckSpecification.hasName(name))
                .and(DeckSpecification.hasFormat(format))
                .and(DeckSpecification.hasUser(username));

        List<Deck> decks = deckRepository.findAll(spec)
                .stream()
                .filter(deck -> deck.getUpdatedAt() != null)
                .sorted(Comparator.comparing(d -> d.getUpdatedAt()))
                .toList();

        List<DeckDto> dtos = new ArrayList<>();
        for (Deck deck : decks) {
            dtos.add(deckMapper.toDto(deck));
        }
        return dtos;
    }

    public Boolean existsById(Long id) {
        return deckRepository.existsById(id);
    }

    public DeckDto getDeckById(Long id) {
        Specification<Deck> spec = Specification.where(DeckSpecification.fetchCards())
                .and((root, query, builder) -> builder.equal(root.get("id"), id));
        Deck deck = deckRepository.findOne(spec)
                .orElseThrow(() -> new NoSuchElementException("Deck not found"));
        return deckMapper.toDto(deck);
    }

    public void validateDeck(DeckDto deckDto) {
        deckValidationService.validate(deckDto);
    }

    @Transactional
    public DeckDto createDeck(DeckDto deckDto, User user) {
        Map<Long, Card> cardMap = deckValidationService.validate(deckDto);

        Deck deck = deckMapper.toEntity(deckDto);
        deck.setUser(user);

        saveDeckCards(deck, deckDto.getDeckCards(), cardMap);

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    @Transactional
    public DeckDto updateDeck(Long id, DeckDto deckDto, User user) {
        Deck deck = deckRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new NoSuchElementException("Deck not found or unauthorized"));

        Map<Long, Card> cardMap = deckValidationService.validate(deckDto);

        deckMapper.updateEntityFromDto(deckDto, deck);

        saveDeckCards(deck, deckDto.getDeckCards(), cardMap);

        Deck savedDeck = deckRepository.save(deck);
        return deckMapper.toDto(savedDeck);
    }

    public void saveDeckCards(Deck deck, List<DeckCardDto> cardDtos, Map<Long, Card> cardMap) {
        List<DeckCard> newDeckCards = new ArrayList<>();
        if (cardDtos != null && !cardDtos.isEmpty()) {
            for (DeckCardDto cardDto : cardDtos) {
                Card card = cardMap.get(cardDto.getCardId());
                if (card == null) {
                    throw new IllegalArgumentException("Card not found with ID: " + cardDto.getCardId());
                }
                newDeckCards.add(deckCardMapper.toEntity(cardDto, deck, card));
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