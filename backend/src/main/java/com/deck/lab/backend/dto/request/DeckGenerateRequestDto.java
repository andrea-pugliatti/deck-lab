package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DeckGenerateRequestDto {
    @NotBlank(message = "Archetype is required")
    private String archetype;

    @NotBlank(message = "Strategy is required")
    private String strategy;

    @NotBlank(message = "Format name is required")
    private String formatName;

    private String customPrompt;

    public DeckGenerateRequestDto() {
    }

    public DeckGenerateRequestDto(String archetype, String strategy, String formatName, String customPrompt) {
        this.archetype = archetype;
        this.strategy = strategy;
        this.formatName = formatName;
        this.customPrompt = customPrompt;
    }

    public String getArchetype() {
        return archetype;
    }

    public void setArchetype(String archetype) {
        this.archetype = archetype;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public String getFormatName() {
        return formatName;
    }

    public void setFormatName(String formatName) {
        this.formatName = formatName;
    }

    public String getCustomPrompt() {
        return customPrompt;
    }

    public void setCustomPrompt(String customPrompt) {
        this.customPrompt = customPrompt;
    }
}
