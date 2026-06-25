package com.deck.lab.backend.model.converter;

import com.deck.lab.backend.model.CardRace;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CardRaceConverter implements AttributeConverter<CardRace, String> {

    @Override
    public String convertToDatabaseColumn(CardRace race) {
        return race != null ? race.getValue() : null;
    }

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
