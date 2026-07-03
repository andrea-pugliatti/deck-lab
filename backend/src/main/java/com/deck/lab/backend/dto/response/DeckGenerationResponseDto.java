package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object (DTO) representing the response payload for a
 * successfully generated deck list.
 *
 * <p>
 * <strong>Response DTO</strong>
 * </p>
 * <p>
 * Unlike raw AI responses, this DTO contains fully resolved database entities
 * (translated to {@link DeckCardDto}) along with a list of validation warnings
 * (such as card limit issues or unknown cards). Returning validation warning
 * lists directly to the client enables a rich user interface experience where
 * users can see what formatting corrections were automatically applied to their
 * AI-generated deck list.
 * </p>
 */
public class DeckGenerationResponseDto {
    private String name;
    private String description;
    private String formatName;
    private List<DeckCardDto> deckCards = new ArrayList<>();
    private List<String> validationWarnings = new ArrayList<>();

    public DeckGenerationResponseDto() {
    }

    public DeckGenerationResponseDto(String name, String description, String formatName,
            List<DeckCardDto> deckCards, List<String> validationWarnings) {
        this.name = name;
        this.description = description;
        this.formatName = formatName;
        this.deckCards = deckCards;
        this.validationWarnings = validationWarnings;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public List<DeckCardDto> getDeckCards() {
        return deckCards;
    }

    public void setDeckCards(List<DeckCardDto> deckCards) {
        this.deckCards = deckCards;
    }

    public List<String> getValidationWarnings() {
        return validationWarnings;
    }

    public void setValidationWarnings(List<String> validationWarnings) {
        this.validationWarnings = validationWarnings;
    }
}
