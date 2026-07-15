package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.CardRace;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Attribute Converter mapping {@link CardRace} Enums to database character strings.
 * 
 * <p>
 * <b>JPA Attribute Converter:</b> Maps type-safe {@code CardRace} instances (like {@code DRAGON})
 * to database strings (like "Dragon") and back, utilizing automatic Hibernate database session
 * hooks.
 * </p>
 */
@Converter(autoApply = true)
public class CardRaceConverter implements AttributeConverter<CardRace, String> {

    /**
     * Converts a {@link CardRace} Java Enum value into its string column representation for SQL
     * storage.
     *
     * @param race the Enum value
     * @return DB string representation
     */
    @Override
    public String convertToDatabaseColumn(CardRace race) {
        return race != null
                ? race.getValue()
                : null;
    }

    /**
     * Converts a SQL string value read from the database back into a type-safe {@link CardRace}
     * Enum.
     *
     * @param dbData database string column value
     * @return resolved CardRace Enum, or null if invalid/null
     */
    @Override
    public CardRace convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return CardRace.fromString(dbData);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
