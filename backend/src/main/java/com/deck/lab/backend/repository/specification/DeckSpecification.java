package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.Format;

import jakarta.persistence.criteria.JoinType;

/**
 * Utility class compiling JPA specifications for dynamic filtering of {@link Deck} records.
 * 
 * <p>
 * <b>JPA Specification Pattern:</b> Instead of writing multiple custom repository query methods
 * (e.g. {@code findByNameAndFormatAndUser}), Spring Data JPA supports the Specification pattern
 * (based on the DDD "Specification" concept). Each method here returns a {@link Specification}
 * object representing a single database search filter (e.g., matching name, matching format, or
 * joining user tables). These small criteria can be dynamically chained together at runtime in the
 * service layer using {@code .and()} or {@code .or()} blocks, providing flexibility for query
 * combinations.
 */
public class DeckSpecification {
    private DeckSpecification() {
    }

    /**
     * Builds a specification checking if a deck's name contains the query string
     * (case-insensitive).
     *
     * @param name search query substring
     * @return dynamic JPA Specification criteria, or null if query is blank
     */
    public static Specification<Deck> hasName(String name) {
        return (root, query, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    /**
     * Builds a specification matching the deck's format value exactly.
     *
     * @param format format name string (e.g. GOAT, EDISON)
     * @return dynamic JPA Specification criteria
     */
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

    /**
     * Builds a specification matching the deck owner's username exactly. Joins the {@code User}
     * relation table under the hood.
     *
     * @param username owner username exact match
     * @return dynamic JPA Specification criteria
     */
    public static Specification<Deck> hasUser(String username) {
        return (root, query, builder) -> (username == null || username.isBlank())
                ? null
                : builder.equal(builder.lower(root.join("user").get("username")),
                                username.toLowerCase());
    }

    /**
     * Optimizes database loading by eagerly fetching the list of {@code deckCards} and their
     * associated {@code Card} properties in a single SQL JOIN query, solving the N+1 select
     * problem.
     *
     * @return dynamic JPA Specification fetch directives
     */
    public static Specification<Deck> fetchCards() {
        return (root, query, builder) -> {
            Class<?> resultType = query.getResultType();
            if (resultType != Long.class && resultType != long.class) {
                root.fetch("deckCards", JoinType.LEFT).fetch("card", JoinType.LEFT);
            }
            return null;
        };
    }
}
