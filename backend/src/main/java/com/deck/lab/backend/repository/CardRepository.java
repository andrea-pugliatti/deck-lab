package com.deck.lab.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.deck.lab.backend.model.Card;

public interface CardRepository extends JpaRepository<Card, Long>, JpaSpecificationExecutor<Card> {
        Optional<Card> findByName(String name);

        List<Card> findByNameContainingIgnoreCase(String name);

        List<Card> findDistinctByAttributeNotNull();

        List<Card> findDistinctByRaceNotNull();

        List<Card> findDistinctByArchetypeNotNullAndArchetypeNot(String empty);

        List<Card> findDistinctByTypeNotNull();
}
