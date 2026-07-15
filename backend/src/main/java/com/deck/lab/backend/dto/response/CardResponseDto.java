package com.deck.lab.backend.dto.response;

import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object (DTO) representing detailed card statistics and attributes.
 *
 * <p>
 * <strong>Data Transfer Object (DTO)</strong>
 * </p>
 * <p>
 * This class encapsulates card details (such as name, type, stats, image URLs) and exposes them to
 * the API client. By using a DTO instead of sending the JPA database entity directly, we decouple
 * the internal database mapping structure (defined in {@link Card}) from the external JSON API
 * contract.
 * </p>
 *
 * <p>
 * <strong>Benefits:</strong>
 * </p>
 * <ul>
 * <li><strong>API Stability:</strong> If database column structures change, the DTO interface can
 * remain stable, avoiding breaking client applications.</li>
 * <li><strong>Performance optimization:</strong> Eliminates circular references or lazy-loading
 * issues common in Hibernate/JPA entities when serialized directly to JSON.</li>
 * <li><strong>Input Validation:</strong> Annotations like {@code @NotBlank} are processed by
 * Spring's validation engine before any processing logic runs.</li>
 * </ul>
 */
public class CardResponseDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    /**
     * Classification category string (e.g. "Spell Card", "Effect Monster").
     */
    @NotBlank(message = "Type is required")
    private String type;

    /**
     * Text detailing card effects or flavor text.
     */
    private String description;

    /**
     * Card monster race or sub-classification.
     */
    private String race;

    /**
     * Monster elemental attribute.
     */
    private String attribute;

    /**
     * Archetype group name the card belongs to.
     */
    private String archetype;

    private String imageUrl;
    private String imageUrlCropped;

    /**
     * Visual frame border style color representation.
     */
    private String frameType;

    /**
     * Monster Attack points value.
     */
    private Integer atk;

    /**
     * Monster Defense points value.
     */
    private Integer def;

    /**
     * Monster Level or Rank rating.
     */
    private Integer level;

    /**
     * Monster Link Rating value.
     */
    private Integer linkVal;

    /**
     * Monster Pendulum Scale rating.
     */
    private Integer scale;

    public CardResponseDto() {
    }

    public CardResponseDto(Long id,
                           String name,
                           String type,
                           String description,
                           String race,
                           String attribute,
                           String archetype,
                           String imageUrl,
                           String imageUrlCropped,
                           String frameType,
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
