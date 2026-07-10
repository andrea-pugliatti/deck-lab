package com.deck.lab.backend.service.generation.tool.dto;

import java.util.List;

/**
 * Response record containing list of search results.
 */
public record CardSearchResponse(List<CardSearchResult> results) {
}