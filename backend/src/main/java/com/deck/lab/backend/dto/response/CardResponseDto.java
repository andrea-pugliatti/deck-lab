package com.deck.lab.backend.dto.response;

import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object (DTO) representing detailed card statistics and attributes.
 */
public class CardResponseDto {

    private Long id;

    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private CardType type;

    private String description;

    private CardRace race;

    private CardAttribute attribute;

    private String archetype;

    private String imageUrl;
    private String imageUrlCropped;

    private FrameType frameType;

    private Integer atk;
    private Integer def;
    private Integer level;
    private Integer linkVal;
    private Integer scale;

    public CardResponseDto() {
    }

    public CardResponseDto(Long id,
                           String name,
                           CardType type,
                           String description,
                           CardRace race,
                           CardAttribute attribute,
                           String archetype,
                           String imageUrl,
                           String imageUrlCropped,
                           FrameType frameType,
                           Integer atk,
                           Integer def,
                           Integer level,
                           Integer linkVal,
                           Integer scale) {
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

    public CardType getType() {
        return type;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CardRace getRace() {
        return race;
    }

    public void setRace(CardRace race) {
        this.race = race;
    }

    public CardAttribute getAttribute() {
        return attribute;
    }

    public void setAttribute(CardAttribute attribute) {
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

    public FrameType getFrameType() {
        return frameType;
    }

    public void setFrameType(FrameType frameType) {
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
