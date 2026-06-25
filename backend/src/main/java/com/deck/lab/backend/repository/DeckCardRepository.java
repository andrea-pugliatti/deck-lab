package com.deck.lab.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.DeckCard;

public interface DeckCardRepository extends JpaRepository<DeckCard, Long> {
}
