package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.CardType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Attribute Converter mapping {@link CardType} Enums to database character
 * strings.
 * 
 * <p>
 * <b>JPA Attribute Converter:</b>
 * Maps type-safe {@code CardType} instances (like {@code NORMAL_MONSTER}) to
 * database strings (like "Normal Monster") and back, utilizing automatic
 * Hibernate database session hooks.
 * </p>
 */
@Converter(autoApply = true)
public class CardTypeConverter implements AttributeConverter<CardType, String> {

    /**
     * Converts a {@link CardType} Java Enum value into its string column
     * representation for SQL storage.
     *
     * @param type the Enum value
     * @return DB string representation
     */
    @Override
    public String convertToDatabaseColumn(CardType type) {
        return type != null ? type.getValue() : null;
    }

    /**
     * Converts a SQL string value read from the database back into a type-safe
     * {@link CardType} Enum.
     *
     * @param dbData database string column value
     * @return resolved CardType Enum, or null if invalid/null
     */
    @Override
    public CardType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return CardType.fromString(dbData);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
