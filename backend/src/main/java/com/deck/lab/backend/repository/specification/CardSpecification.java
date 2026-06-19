package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.PredicateSpecification;

import com.deck.lab.backend.model.Card;

public class CardSpecification {
    private CardSpecification() {
    }

    public static PredicateSpecification<Card> hasName(String name) {
        return (from, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(from.get("name"), "%" + name + "%");
    }

    public static PredicateSpecification<Card> hasType(String type) {
        return (from, builder) -> (type == null || type.isBlank())
                ? null
                : builder.like(from.get("type"), "%" + type + "%");
    }

    public static PredicateSpecification<Card> hasAttribute(String attribute) {
        return (from, builder) -> (attribute == null || attribute.isBlank())
                ? null
                : builder.like(from.get("attribute"), "%" + attribute + "%");
    }

    public static PredicateSpecification<Card> hasRace(String race) {
        return (from, builder) -> (race == null || race.isBlank())
                ? null
                : builder.like(from.get("race"), "%" + race + "%");
    }

    public static PredicateSpecification<Card> hasArchetype(String archetype) {
        return (from, builder) -> (archetype == null || archetype.isBlank())
                ? null
                : builder.like(from.get("archetype"), "%" + archetype + "%");
    }
}
