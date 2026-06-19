package com.deck.lab.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByUser(User user);

    Optional<Deck> findByIdAndUser(Long id, User user);

    @Query("SELECT d FROM Deck d LEFT JOIN FETCH d.deckCards dc LEFT JOIN FETCH dc.card WHERE d.user = :user")
    List<Deck> findByUserWithCards(@Param("user") User user);

    @Query("SELECT d FROM Deck d LEFT JOIN FETCH d.deckCards dc LEFT JOIN FETCH dc.card WHERE d.id = :id AND d.user = :user")
    Optional<Deck> findByIdAndUserWithCards(@Param("id") Long id, @Param("user") User user);
}
