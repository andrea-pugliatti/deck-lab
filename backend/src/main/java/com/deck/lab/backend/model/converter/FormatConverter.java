package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.Format;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Attribute Converter mapping {@link Format} Enums to database character
 * strings.
 * 
 * <p>
 * <b>JPA Attribute Converter:</b>
 * Maps type-safe {@code Format} instances (like {@code GOAT}) to database
 * strings (like "Goat") and back, utilizing automatic Hibernate database
 * session hooks.
 * </p>
 */
@Converter(autoApply = true)
public class FormatConverter implements AttributeConverter<Format, String> {

    /**
     * Converts a {@link Format} Java Enum value into its string column
     * representation for SQL storage.
     *
     * @param format the Enum value
     * @return DB string representation
     */
    @Override
    public String convertToDatabaseColumn(Format format) {
        return format != null ? format.getValue() : null;
    }

    /**
     * Converts a SQL string value read from the database back into a type-safe
     * {@link Format} Enum.
     *
     * @param dbData database string column value
     * @return resolved Format Enum, or null if invalid/null
     */
    @Override
    public Format convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return Format.fromString(dbData);
        } catch (IllegalArgumentException e) {
            // Log/fallback if database contains unexpected format values
            return null;
        }
    }
}
