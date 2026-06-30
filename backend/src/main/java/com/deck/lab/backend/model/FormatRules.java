package com.deck.lab.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

/**
 * Domain model entity representing format-specific banlist rules for individual
 * cards.
 *
 * <p>
 * <strong>Domain Rule Configuration Entity</strong>
 * </p>
 * <p>
 * Yu-Gi-Oh! formats (e.g. Goat, Edison, Modern TCG) enforce deck-building
 * constraints by restricting the number of copies of certain cards allowed in a
 * deck. This class maps these banlist rules to the database. Each record
 * specifies a card, the format it applies to, and its current status (e.g.,
 * FORBIDDEN = 0 copies, LIMITED = 1 copy, SEMI_LIMITED = 2 copies).
 * </p>
 *
 * <p>
 * <strong>JPA Configuration & Mappings:</strong>
 * </p>
 * <ul>
 * <li>{@code formatName}: Serialized to/from the database using the
 * {@link FormatConverter} attribute converter, mapping format enums (like
 * {@link Format}) to normalized database strings.</li>
 * <li>{@code card}: Linked via a {@code @ManyToOne} relationship. We use
 * {@code FetchType.LAZY} to prevent loading full {@link Card} statistics when
 * checking simple format rule definitions.</li>
 * <li>{@code status}: Maps the {@link CardStatus} restriction using standard
 * {@code @Enumerated(EnumType.STRING)}, ensuring card limitation levels are
 * stored legibly.</li>
 * </ul>
 */
@Entity
@Table(name = "format_rules")
public class FormatRules {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "format_name", nullable = false)
    private Format formatName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Enumerated(EnumType.STRING)
    @NotNull
    private CardStatus status;

    public FormatRules() {
    }

    public FormatRules(Format formatName, Card card, CardStatus status) {
        this.formatName = formatName;
        this.card = card;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Format getFormatName() {
        return formatName;
    }

    public void setFormatName(Format formatName) {
        this.formatName = formatName;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public CardStatus getStatus() {
        return status;
    }

    public void setStatus(CardStatus status) {
        this.status = status;
    }
}
