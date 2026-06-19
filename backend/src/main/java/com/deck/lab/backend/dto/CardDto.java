package com.deck.lab.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CardDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    private String description;
    private String race;
    private String attribute;
    private String archetype;
    private String imageUrl;
    private String imageUrlCropped;
    private String frameType;
    private Integer atk;
    private Integer def;
    private Integer level;
    private Integer linkVal;
    private Integer scale;

    public CardDTO() {
    }

    public CardDTO(Long id, String name, String type, String description, String race, String attribute,
            String archetype, String imageUrl, String imageUrlCropped, String frameType, Integer atk, Integer def,
            Integer level, Integer linkVal, Integer scale) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.race = race;
        this.attribute = attribute;
        this.archetype = archetype;
        this.imageUrl = imageUrl;
        this.imageUrlCropped = imageUrlCropped;
        this.frameType = frameType;
        this.atk = atk;
        this.def = def;
        this.level = level;
        this.linkVal = linkVal;
        this.scale = scale;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRace() {
        return race;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getArchetype() {
        return archetype;
    }

    public void setArchetype(String archetype) {
        this.archetype = archetype;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageUrlCropped() {
        return imageUrlCropped;
    }

    public void setImageUrlCropped(String imageUrlCropped) {
        this.imageUrlCropped = imageUrlCropped;
    }

    public String getFrameType() {
        return frameType;
    }

    public void setFrameType(String frameType) {
        this.frameType = frameType;
    }

    public Integer getAtk() {
        return atk;
    }

    public void setAtk(Integer atk) {
        this.atk = atk;
    }

    public Integer getDef() {
        return def;
    }

    public void setDef(Integer def) {
        this.def = def;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getLinkVal() {
        return linkVal;
    }

    public void setLinkVal(Integer linkVal) {
        this.linkVal = linkVal;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }
}
