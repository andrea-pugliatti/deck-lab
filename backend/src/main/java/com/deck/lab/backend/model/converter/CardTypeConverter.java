package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.CardType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CardTypeConverter implements AttributeConverter<CardType, String> {

    @Override
    public String convertToDatabaseColumn(CardType type) {
        return type != null ? type.getValue() : null;
    }

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
