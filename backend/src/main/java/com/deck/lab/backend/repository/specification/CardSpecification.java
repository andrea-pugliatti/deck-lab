package com.deck.lab.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;

/**
 * Utility class compiling JPA specifications for dynamic filtering of {@link Card} records.
 *
 * <p><strong>JPA Specification (Domain-Driven Design Specification Pattern)</strong></p>
 * <p>Instead of declaring custom repository finder methods for every possible search filter combination
 * (e.g. {@code findByNameAndTypeAndAttributeAndRace}), this application leverages Spring Data JPA's Specification capabilities.
 * Specifications are reusable query criteria predicates built on top of the JPA Criteria API. They allow developers to programmatically
 * build and chain dynamic SQL WHERE clauses (using {@code AND} and {@code OR} logic) at runtime in the service layer.</p>
 *
 * <p><strong>Security & Safety:</strong></p>
 * <p>Using JPA Specifications prevents SQL injection vulnerabilities. Hibernate compiles the Java criteria objects
 * into parameterized SQL queries, ensuring any string inputs (like user card search parameters) are treated as literal values
 * rather than executable SQL fragments.</p>
 */
public class CardSpecification {
    private CardSpecification() {
    }

    /**
     * Builds a specification checking if a card's name contains the query string.
     *
     * @param name search query substring
     * @return dynamic JPA Specification criteria
     */
    public static Specification<Card> hasName(String name) {
        return (root, query, builder) -> (name == null || name.isBlank())
                ? null
                : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    /**
     * Builds a specification matching the card's classification type exactly.
     *
     * @param type card type string (e.g. Spell Card, Normal Monster)
     * @return dynamic JPA Specification criteria
     */
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

    /**
     * Builds a specification matching the card's attribute exactly.
     *
     * @param attribute card attribute string (e.g. LIGHT, DARK)
     * @return dynamic JPA Specification criteria
     */
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

    /**
     * Builds a specification matching the card's race exactly.
     *
     * @param race card race string (e.g. Spellcaster, Dragon)
     * @return dynamic JPA Specification criteria
     */
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

    /**
     * Builds a specification checking if a card's archetype contains the query string.
     *
     * @param archetype archetype substring match
     * @return dynamic JPA Specification criteria
     */
    public static Specification<Card> hasArchetype(String archetype) {
        return (root, query, builder) -> (archetype == null || archetype.isBlank())
                ? null
                : builder.like(builder.lower(root.get("archetype")), "%" + archetype.toLowerCase() + "%");
    }
}
