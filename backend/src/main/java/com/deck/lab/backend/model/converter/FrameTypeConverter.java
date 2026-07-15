package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.FrameType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Attribute Converter mapping {@link FrameType} Enums to database character strings.
 * 
 * <p>
 * <b>JPA Attribute Converter:</b> Databases usually store Enums as generic strings (e.g. "spell",
 * "effect"). However, within Java we want type-safety. By implementing {@link AttributeConverter}
 * and marking it with {@code @Converter(autoApply = true)}, Hibernate automatically intercepts
 * persistence writes/reads, converting Java {@code FrameType} instances into database strings and
 * vice versa, without requiring manual mapping on every query.
 */
@Converter(autoApply = true)
public class FrameTypeConverter implements AttributeConverter<FrameType, String> {

    /**
     * Converts a {@link FrameType} Java Enum value into its string column representation for SQL
     * storage.
     *
     * @param type the Enum value
     * @return DB string representation
     */
    @Override
    public String convertToDatabaseColumn(FrameType type) {
        return type != null
                ? type.getValue()
                : null;
    }

    /**
     * Converts a SQL string value read from the database back into a type-safe {@link FrameType}
     * Enum.
     *
     * @param dbData database string column value
     * @return resolved FrameType Enum, or null if invalid/null
     */
    @Override
    public FrameType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return FrameType.fromString(dbData);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
