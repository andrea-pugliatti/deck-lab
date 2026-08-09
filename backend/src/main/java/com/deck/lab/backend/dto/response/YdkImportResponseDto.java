package com.deck.lab.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO representing the result of a YDK deck import operation, including resolved card structure and
 * any warnings for unmapped passcodes.
 */
public class YdkImportResponseDto {

    private DeckResponseDto deck;
    private List<String> warnings = new ArrayList<>();

    public YdkImportResponseDto() {
    }

    public YdkImportResponseDto(DeckResponseDto deck, List<String> warnings) {
        this.deck = deck;
        if (warnings != null) {
            this.warnings = warnings;
        }
    }

    public DeckResponseDto getDeck() {
        return deck;
    }

    public void setDeck(DeckResponseDto deck) {
        this.deck = deck;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
}
