package com.deck.lab.backend.dto.request;

import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object representing an inbound card create or update request.
 */
public class CardSaveRequestDto {

    private Long passcode;

    @NotBlank(message = "Card name is required")
    private String name;

    @NotNull(message = "Card type is required")
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

    /**
     * Default no-argument constructor.
     */
    public CardSaveRequestDto() {
    }

    /**
     * Full constructor initializing all fields of the card save request.
     *
     * @param passcode        the unique passcode of the card
     * @param name            the name of the card
     * @param type            the classification type of the card
     * @param description     the card text or effect description
     * @param race            the race or subtype of the card
     * @param attribute       the element attribute of the card
     * @param archetype       the archetype grouping of the card
     * @param imageUrl        the relative URL to the full card image
     * @param imageUrlCropped the relative URL to the cropped card art image
     * @param frameType       the frame border style
     * @param atk             the attack stat value
     * @param def             the defense stat value
     * @param level           the level, rank, or link rating
     * @param linkVal         the link value
     * @param scale           the pendulum scale
     */
    public CardSaveRequestDto(Long passcode,
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
        this.passcode = passcode;
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

    public Long getPasscode() {
        return passcode;
    }

    public void setPasscode(Long passcode) {
        this.passcode = passcode;
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
