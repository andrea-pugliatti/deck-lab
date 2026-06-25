package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.FrameType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FrameTypeConverter implements AttributeConverter<FrameType, String> {

    @Override
    public String convertToDatabaseColumn(FrameType type) {
        return type != null ? type.getValue() : null;
    }

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
