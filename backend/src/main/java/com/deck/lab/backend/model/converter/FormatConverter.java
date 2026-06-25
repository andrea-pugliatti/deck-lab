package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.Format;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FormatConverter implements AttributeConverter<Format, String> {

    @Override
    public String convertToDatabaseColumn(Format format) {
        return format != null ? format.getValue() : null;
    }

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
