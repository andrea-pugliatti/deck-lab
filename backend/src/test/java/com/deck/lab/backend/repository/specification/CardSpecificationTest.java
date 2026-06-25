package com.deck.lab.backend.repository.specification;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;

@SpringBootTest
@Transactional
class CardSpecificationTest {

    @Autowired
    private CardRepository cardRepository;

    private Card card1;
    private Card card2;
    private Card card3;

    @BeforeEach
    void setUp() {
        // Save distinct test cards to avoid collisions with seeded database records
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
    void hasName_filtersCorrectly() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasName("SpecTest Blue-Eyes"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));

        results = cardRepository.findAll(CardSpecification.hasName("SpecTest"));
        // Should find all 3 test cards (plus potentially others, but at least our 3)
        assertTrue(results.size() >= 3);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card2.getName())));
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card3.getName())));
    }

    @Test
    void hasType_filtersCorrectly() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasType("Effect Monster"));
        // Slifer is Effect, others are Normal
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card3.getName())));
        assertFalse(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));
    }

    @Test
    void hasAttribute_filtersCorrectly() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasAttribute("DARK"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card2.getName())));
        assertFalse(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));
    }

    @Test
    void hasRace_filtersCorrectly() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasRace("Spellcaster"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card2.getName())));
        assertFalse(results.stream().anyMatch(c -> c.getName().equals(card3.getName())));
    }

    @Test
    void hasArchetype_filtersCorrectly() {
        List<Card> results = cardRepository.findAll(CardSpecification.hasArchetype("Slifer"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card3.getName())));
    }

    @Test
    void combinedSpecifications_filtersCorrectly() {
        // Query for Dragon (race) + Normal Monster (type) + SpecTest (name)
        Specification<Card> spec = Specification
                .where(CardSpecification.hasName("SpecTest"))
                .and(CardSpecification.hasRace("Dragon"))
                .and(CardSpecification.hasType("Normal Monster"));

        List<Card> results = cardRepository.findAll(spec);
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));
    }

    @Test
    void caseInsensitiveFilters_matchCorrectly() {
        // Query for "spectest blue-eyes" (lowercase) should match "SpecTest Blue-Eyes
        // White Dragon"
        List<Card> results = cardRepository.findAll(CardSpecification.hasName("spectest blue-eyes"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));

        // Query for "normal monster" (lowercase) should match Normal Monster
        results = cardRepository.findAll(CardSpecification.hasType("normal monster"));
        assertTrue(results.size() >= 2);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card1.getName())));
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card2.getName())));

        // Query for "dark" (lowercase) should match DARK attribute
        results = cardRepository.findAll(CardSpecification.hasAttribute("dark"));
        assertTrue(results.size() >= 1);
        assertTrue(results.stream().anyMatch(c -> c.getName().equals(card2.getName())));
    }

    @Test
    void nullOrBlankFilters_ignoredCorrectly() {
        // Blanks and nulls should result in no filter constraints (i.e. returns all
        // cards)
        Specification<Card> spec = Specification
                .where(CardSpecification.hasName(null))
                .and(CardSpecification.hasType(""))
                .and(CardSpecification.hasAttribute("   "));

        List<Card> results = cardRepository.findAll(spec);
        // Should return all cards in the database, which is at least 3
        assertTrue(results.size() >= 3);
    }
}
