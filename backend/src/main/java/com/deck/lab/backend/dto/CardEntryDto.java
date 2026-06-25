package com.deck.lab.backend.dto;

public class CardEntryDto {
    private String name;
    private String section;
    private Integer quantity;

    public CardEntryDto() {
    }

    public CardEntryDto(String name, String section, Integer quantity) {
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