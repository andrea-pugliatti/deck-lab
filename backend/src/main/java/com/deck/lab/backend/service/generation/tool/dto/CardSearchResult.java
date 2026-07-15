package com.deck.lab.backend.service.generation.tool.dto;

/**
 * Nested info record mapping card ID, name, type, and archetype.
 */
public record CardSearchResult(Long id, String name, String type, String archetype) {}