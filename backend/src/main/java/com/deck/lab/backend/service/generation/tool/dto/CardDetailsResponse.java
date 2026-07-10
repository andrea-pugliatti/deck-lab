package com.deck.lab.backend.service.generation.tool.dto;

/**
 * Response record containing complete card statistics and resource details.
 */
public record CardDetailsResponse(
        Long id,
        String name,
        String type,
        String description,
        String race,
        String attribute,
        String archetype,
        Integer atk,
        Integer def,
        Integer level,
        Integer linkVal,
        Integer scale,
        String imageUrl,
        String imageUrlCropped) {
}