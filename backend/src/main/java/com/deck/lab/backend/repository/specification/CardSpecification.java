package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Card;

public class CardSpecification {
    private CardSpecification() {
    }

    public static Specification<Card> hasName(String name) {
        return (root, query, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Card> hasType(String type) {
        return (root, query, builder) -> (type == null || type.isBlank())
                ? null
                : builder.like(builder.lower(root.get("type")), "%" + type.toLowerCase() + "%");
    }

    public static Specification<Card> hasAttribute(String attribute) {
        return (root, query, builder) -> (attribute == null || attribute.isBlank())
                ? null
                : builder.like(builder.lower(root.get("attribute")), "%" + attribute.toLowerCase() + "%");
    }

    public static Specification<Card> hasRace(String race) {
        return (root, query, builder) -> (race == null || race.isBlank())
                ? null
                : builder.like(builder.lower(root.get("race")), "%" + race.toLowerCase() + "%");
    }

    public static Specification<Card> hasArchetype(String archetype) {
        return (root, query, builder) -> (archetype == null || archetype.isBlank())
                ? null
                : builder.like(builder.lower(root.get("archetype")), "%" + archetype.toLowerCase() + "%");
    }
}
