package com.deck.lab.backend.service.generation;

import java.util.List;

/**
 * Response record containing list of search results.
 */
public record CardSearchResponse(List<CardSearchResult> results) {
}