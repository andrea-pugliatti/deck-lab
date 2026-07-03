package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.response.DeckCardDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;

/**
 * Mapper component that translates database-relational {@link DeckCard} join
 * entities to flattened {@link DeckCardDto} representations and vice versa.
 *
 * <p>
 * <b>Relational Joins & Flat DTOs:</b>
 * In relational databases, many-to-many associations are managed via a join
 * table containing foreign keys. In JPA, this is represented by the
 * {@link DeckCard} entity which holds references to both {@link Deck} and
 * {@link Card}. However, API clients prefer a flattened JSON structure that
 * includes detailed card details directly. This mapper resolves references,
 * flattens card properties (like name, type, and race), and provides a simple
 * JSON layout to the client.
 * </p>
 */
@Component
public class DeckCardMapper {

    /**
     * Translates a {@link DeckCard} database association entity into a flat
     * {@link DeckCardDto} record.
     * Incorporates detailed card database columns directly onto the DTO fields.
     *
     * @param dc the DeckCard join entity
     * @return the flattened DeckCardDto payload
     */
    public DeckCardDto toDto(DeckCard dc) {
        if (dc == null) {
            return null;
        }
        Card c = dc.getCard();
        if (c == null) {
            return new DeckCardDto(
                    dc.getId(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    dc.getSection() != null ? dc.getSection().getValue() : null,
                    dc.getQuantity());
        }
        return new DeckCardDto(
                dc.getId(),
                c.getId(),
                c.getName(),
                c.getType() != null ? c.getType().getValue() : null,
                c.getDescription(),
                c.getRace() != null ? c.getRace().getValue() : null,
                c.getAttribute() != null ? c.getAttribute().getValue() : null,
                c.getArchetype(),
                c.getImageUrl(),
                dc.getSection() != null ? dc.getSection().getValue() : null,
                dc.getQuantity());
    }

    /**
     * Converts a incoming {@link DeckCardDto} back into a relational
     * {@link DeckCard} database entity.
     * Links the correct {@link Deck} and {@link Card} context mappings.
     *
     * @param dto  the input card mapping received from the client request
     * @param deck the database-managed parent Deck entity
     * @param card the database-managed Card entity referenced
     * @return a populated DeckCard join entity mapping
     */
    public DeckCard toEntity(DeckCardDto dto, Deck deck, Card card) {
        if (dto == null) {
            return null;
        }
        DeckSection sectionEnum = null;
        try {
            sectionEnum = dto.getSection() != null ? DeckSection.fromString(dto.getSection()) : null;
        } catch (IllegalArgumentException e) {
            // Fallback/ignore invalid section
        }
        DeckCard dc = new DeckCard(deck, card, sectionEnum, dto.getQuantity());
        dc.setId(dto.getId());
        return dc;
    }
}
