package com.deck.lab.backend.repository.specification;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DisplayName("CardSpecification JPA Slice Integration Tests")
class CardSpecificationTest {

    @Autowired
    private CardRepository cardRepository;

    private Card card1;
    private Card card2;
    private Card card3;

    @BeforeEach
    void setUp() {
        card1 = new Card();
        card1.setName("SpecTest Blue-Eyes White Dragon");
        card1.setType(CardType.NORMAL_MONSTER);
        card1.setFrameType(FrameType.NORMAL);
        card1.setDescription("Legendary dragon.");
        card1.setRace(CardRace.DRAGON);
        card1.setAttribute(CardAttribute.LIGHT);
        card1.setArchetype("Blue-Eyes");
        card1.setImageUrl("/cards/images/spec1.jpg");
        card1.setImageUrlCropped("/cards/images/cropped/spec1.jpg");
        card1.setAtk(3000);
        card1.setDef(2500);
        card1.setLevel(8);
        card1 = cardRepository.save(card1);

        card2 = new Card();
        card2.setName("SpecTest Dark Magician");
        card2.setType(CardType.NORMAL_MONSTER);
        card2.setFrameType(FrameType.NORMAL);
        card2.setDescription("Ultimate wizard.");
        card2.setRace(CardRace.SPELLCASTER);
        card2.setAttribute(CardAttribute.DARK);
        card2.setArchetype("Dark Magician");
        card2.setImageUrl("/cards/images/spec2.jpg");
        card2.setImageUrlCropped("/cards/images/cropped/spec2.jpg");
        card2.setAtk(2500);
        card2.setDef(2100);
        card2.setLevel(7);
        card2 = cardRepository.save(card2);

        card3 = new Card();
        card3.setName("SpecTest Slifer the Sky Dragon");
        card3.setType(CardType.EFFECT_MONSTER);
        card3.setFrameType(FrameType.EFFECT);
        card3.setDescription("Divine beast.");
        card3.setRace(CardRace.DIVINE_BEAST);
        card3.setAttribute(CardAttribute.DIVINE);
        card3.setArchetype("Slifer");
        card3.setImageUrl("/cards/images/spec3.jpg");
        card3.setImageUrlCropped("/cards/images/cropped/spec3.jpg");
        card3.setAtk(0);
        card3.setDef(0);
        card3.setLevel(10);
        card3 = cardRepository.save(card3);
    }

    @Test
    @DisplayName("hasName should filter cards by matching name substring")
    void hasName_should_filterCardsByName_when_nameProvided() {
        List<Card> results = cardRepository
                .findAll(CardSpecification.hasName("SpecTest Blue-Eyes"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card1.getName());

        results = cardRepository.findAll(CardSpecification.hasName("SpecTest"));
        assertThat(results).hasSizeGreaterThanOrEqualTo(3);
        assertThat(results).extracting(card -> card.getName()).contains(card1.getName(), card2.getName(), card3.getName());
    }

    @Test
    @DisplayName("hasType should filter cards by matching type")
    void hasType_should_filterCardsByType_when_typeProvided() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasType("Effect Monster"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card3.getName()).doesNotContain(card1.getName());
    }

    @Test
    @DisplayName("hasAttribute should filter cards by matching attribute")
    void hasAttribute_should_filterCardsByAttribute_when_attributeProvided() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasAttribute("DARK"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card2.getName()).doesNotContain(card1.getName());
    }

    @Test
    @DisplayName("hasRace should filter cards by matching race")
    void hasRace_should_filterCardsByRace_when_raceProvided() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasRace("Spellcaster"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card2.getName()).doesNotContain(card3.getName());
    }

    @Test
    @DisplayName("hasArchetype should filter cards by matching archetype")
    void hasArchetype_should_filterCardsByArchetype_when_archetypeProvided() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasArchetype("Slifer"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card3.getName());
    }

    @Test
    @DisplayName("combined specifications should filter correctly across multiple dimensions")
    void combinedSpecifications_should_filterAcrossMultipleCriteria_when_combined() {
        Specification<Card> spec = Specification
                .where(CardSpecification.hasName("SpecTest"))
                .and(CardSpecification.hasRace("Dragon"))
                .and(CardSpecification.hasType("Normal Monster"));

        List<Card> results = cardRepository.findAll(spec);
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card1.getName());
    }

    @Test
    @DisplayName("filters should match case-insensitively")
    void caseInsensitiveFilters_should_matchCards_when_differingCasing() {
        List<Card> results = cardRepository
                .findAll(CardSpecification.hasName("spectest blue-eyes"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card1.getName());

        results = cardRepository.findAll(CardSpecification.hasType("normal monster"));
        assertThat(results).hasSizeGreaterThanOrEqualTo(2);
        assertThat(results).extracting(card -> card.getName()).contains(card1.getName(), card2.getName());

        results = cardRepository.findAll(CardSpecification.hasAttribute("dark"));
        assertThat(results).isNotEmpty();
        assertThat(results).extracting(card -> card.getName()).contains(card2.getName());
    }

    @Test
    @DisplayName("null or blank filter values should be ignored by specification")
    void nullOrBlankFilters_should_returnAllCards_when_ignored() {
        Specification<Card> spec = Specification
                .where(CardSpecification.hasName(null))
                .and(CardSpecification.hasType(""))
                .and(CardSpecification.hasAttribute("   "));

        List<Card> results = cardRepository.findAll(spec);
        assertThat(results).hasSizeGreaterThanOrEqualTo(3);
    }
}
