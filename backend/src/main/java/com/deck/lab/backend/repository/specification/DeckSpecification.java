package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.Format;

import jakarta.persistence.criteria.JoinType;

public class DeckSpecification {
    private DeckSpecification() {
    }

    public static Specification<Deck> hasName(String name) {
        return (root, query, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Deck> hasFormat(String format) {
        return (root, query, builder) -> {
            if (format == null || format.isBlank()) {
                return null;
            }
            try {
                Format f = Format.fromString(format);
                return builder.equal(root.get("formatName"), f);
            } catch (IllegalArgumentException e) {
                return builder.disjunction();
            }
        };
    }

    public static Specification<Deck> hasUser(String username) {
        return (root, query, builder) -> (username == null || username.isBlank())
                ? null
                : builder.equal(builder.lower(root.join("user").get("username")), username.toLowerCase());
    }

    public static Specification<Deck> fetchCards() {
        return (root, query, builder) -> {
            root.fetch("deckCards", JoinType.LEFT).fetch("card", JoinType.LEFT);
            return null;
        };
    }
}
