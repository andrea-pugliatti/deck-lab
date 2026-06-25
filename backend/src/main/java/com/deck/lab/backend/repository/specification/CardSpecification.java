package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;

public class CardSpecification {
    private CardSpecification() {
    }

    public static Specification<Card> hasName(String name) {
        return (root, query, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Card> hasType(String type) {
        return (root, query, builder) -> {
            if (type == null || type.isBlank()) {
                return null;
            }
            try {
                CardType cardType = CardType.fromString(type);
                return builder.equal(root.get("type"), cardType);
            } catch (IllegalArgumentException e) {
                return builder.disjunction();
            }
        };
    }

    public static Specification<Card> hasAttribute(String attribute) {
        return (root, query, builder) -> {
            if (attribute == null || attribute.isBlank()) {
                return null;
            }
            try {
                CardAttribute cardAttr = CardAttribute.fromString(attribute);
                return builder.equal(root.get("attribute"), cardAttr);
            } catch (IllegalArgumentException e) {
                return builder.disjunction();
            }
        };
    }

    public static Specification<Card> hasRace(String race) {
        return (root, query, builder) -> {
            if (race == null || race.isBlank()) {
                return null;
            }
            try {
                CardRace cardRace = CardRace.fromString(race);
                return builder.equal(root.get("race"), cardRace);
            } catch (IllegalArgumentException e) {
                return builder.disjunction();
            }
        };
    }

    public static Specification<Card> hasArchetype(String archetype) {
        return (root, query, builder) -> (archetype == null || archetype.isBlank())
                ? null
                : builder.like(builder.lower(root.get("archetype")), "%" + archetype.toLowerCase() + "%");
    }
}
