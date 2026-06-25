package com.deck.lab.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "card_seq")
    @SequenceGenerator(name = "card_seq", sequenceName = "cards_id_seq", allocationSize = 50)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private CardType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    private CardRace race;

    @Enumerated(EnumType.STRING)
    private CardAttribute attribute;

    private String archetype;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "image_url_cropped")
    private String imageUrlCropped;

    @Column(name = "frame_type")
    private FrameType frameType;

    private Integer atk;

    private Integer def;

    private Integer level;

    @Column(name = "link_val")
    private Integer linkVal;

    private Integer scale;

    public Card() {
    }

    public Card(String name, CardType type, FrameType frameType, String description, CardRace race, CardAttribute attribute,
            String archetype, String imageUrl, String imageUrlCropped, Integer atk, Integer def, Integer level,
            Integer linkVal, Integer scale) {
        this.name = name;
        this.type = type;
        this.frameType = frameType;
        this.description = description;
        this.race = race;
        this.attribute = attribute;
        this.archetype = archetype;
        this.imageUrl = imageUrl;
        this.imageUrlCropped = imageUrlCropped;
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

    public void setLinkVal(Integer linkval) {
        this.linkVal = linkval;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }
}
