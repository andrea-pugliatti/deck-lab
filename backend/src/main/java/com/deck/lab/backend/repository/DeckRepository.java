package com.deck.lab.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface DeckRepository extends JpaRepository<Deck, Long>, JpaSpecificationExecutor<Deck> {
    List<Deck> findByUser(User user);

    Optional<Deck> findByIdAndUser(Long id, User user);
}
