package com.deck.lab.backend.dto.request;

import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.Strategy;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing an incoming request payload to generate a deck list using
 * AI.
 */
public class DeckGenerateRequestDto {
    @NotBlank(message = "Archetype is required")
    private String archetype;

    @NotNull(message = "Strategy is required")
    private Strategy strategy;

    @NotNull(message = "Format name is required")
    private Format formatName;

    private String customPrompt;

    public DeckGenerateRequestDto() {
    }

    public DeckGenerateRequestDto(String archetype,
                                  Strategy strategy,
                                  Format formatName,
                                  String customPrompt) {
        this.archetype = archetype;
        this.strategy = strategy;
        this.formatName = formatName;
        this.customPrompt = customPrompt;
    }

    public DeckGenerateRequestDto(String archetype,
                                  String strategy,
                                  String formatName,
                                  String customPrompt) {
        this.archetype = archetype;
        this.strategy = Strategy.fromString(strategy);
        this.formatName = Format.fromString(formatName);
        this.customPrompt = customPrompt;
    }

    public String getArchetype() {
        return archetype;
    }

    public void setArchetype(String archetype) {
        this.archetype = archetype;
    }

    public Strategy getStrategy() {
        return strategy;
    }

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public Format getFormatName() {
        return formatName;
    }

    public void setFormatName(Format formatName) {
        this.formatName = formatName;
    }

    public String getCustomPrompt() {
        return customPrompt;
    }

    public void setCustomPrompt(String customPrompt) {
        this.customPrompt = customPrompt;
    }
}
