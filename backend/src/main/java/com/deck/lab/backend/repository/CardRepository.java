package com.deck.lab.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.deck.lab.backend.model.Card;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByName(String name);

    List<Card> findByNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Card c WHERE " +
            "(:query IS NULL OR :query = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:type IS NULL OR :type = '' OR LOWER(c.type) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
            "(:attribute IS NULL OR :attribute = '' OR LOWER(c.attribute) LIKE LOWER(CONCAT('%', :attribute, '%'))) AND " +
            "(:race IS NULL OR :race = '' OR LOWER(c.race) LIKE LOWER(CONCAT('%', :race, '%'))) AND " +
            "(:archetype IS NULL OR :archetype = '' OR LOWER(c.archetype) LIKE LOWER(CONCAT('%', :archetype, '%')))")
    List<Card> searchCards(
            @Param("query") String query,
            @Param("type") String type,
            @Param("attribute") String attribute,
            @Param("race") String race,
            @Param("archetype") String archetype,
            Pageable pageable);
}
