package com.deck.lab.backend.service.generation.model;

/**
 * Data Transfer Object (DTO) mapping raw card entries returned from the AI LLM
 * generation.
 *
 * <p>
 * <strong>Data Transfer Object (DTO)</strong>
 * </p>
 * <p>
 * This object serves as a temporary, lightweight transfer payload that captures
 * raw card suggestions and section assignments from external AI/LLM models.
 * Because LLM results are text-based and unverified, this DTO represents the
 * transitional, unvalidated state of a card entry before it is resolved against
 * database records (i.e. checking if the card name exists and fetching its
 * actual ID).
 * </p>
 *
 * <p>
 * By separating this raw input structure from verified entities, we ensure our
 * domain layer only deals with structured, valid database states, insulating
 * internal logic from potential LLM formatting anomalies.
 * </p>
 */
public class CardEntry {

    private String name;

    /**
     * Assigned deck section (e.g. MAIN, EXTRA, SIDE).
     */
    private String section;

    private Integer quantity;

    public CardEntry() {
    }

    public CardEntry(String name, String section, Integer quantity) {
        this.name = name;
        this.section = section;
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}