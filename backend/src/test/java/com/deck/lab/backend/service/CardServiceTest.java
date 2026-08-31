package com.deck.lab.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.exception.ResourceNotFoundException;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;

@SpringBootTest
@Transactional
@DisplayName("CardService Integration Tests")
class CardServiceTest {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CardService cardService;

    private Card testCard;

    @BeforeEach
    void setUp() {
        testCard = new Card();
        testCard.setName("ServiceTest Blue-Eyes");
        testCard.setType(CardType.NORMAL_MONSTER);
        testCard.setFrameType(FrameType.NORMAL);
        testCard.setDescription("Legendary dragon.");
        testCard.setRace(CardRace.DRAGON);
        testCard.setAttribute(CardAttribute.LIGHT);
        testCard.setArchetype("Blue-Eyes");
        testCard.setImageUrl("/cards/images/service1.jpg");
        testCard.setImageUrlCropped("/cards/images/cropped/service1.jpg");
        testCard.setAtk(3000);
        testCard.setDef(2500);
        testCard.setLevel(8);
        testCard = cardRepository.save(testCard);
    }

    @Test
    @DisplayName("findAllOrWithFilters should return matching cards when name query is provided")
    void findAllOrWithFilters_should_returnMatchingCards_when_nameFilterMatches() {
        Page<Card> result = cardService.findAllOrWithFilters("ServiceTest Blue-Eyes",
                null,
                null,
                null,
                null,
                PageRequest.of(0, 10));
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isGreaterThanOrEqualTo(1);
        assertThat(result.getContent())
                .extracting(card -> card.getName())
                .contains(testCard.getName());
    }

    @Test
    @DisplayName("findById should return Optional containing Card when card exists")
    void findById_should_returnCard_when_cardExists() {
        Optional<Card> result = cardService.findById(testCard.getId());
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(testCard.getId());
    }

    @Test
    @DisplayName("findById should return empty Optional when card does not exist")
    void findById_should_returnEmpty_when_cardDoesNotExist() {
        Optional<Card> result = cardService.findById(999999L);
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("getById should return Card entity when card exists")
    void getById_should_returnCard_when_cardExists() {
        Card result = cardService.getById(testCard.getId());
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(testCard.getId());
    }

    @Test
    @DisplayName("getById should throw ResourceNotFoundException with descriptive message when card does not exist")
    void getById_should_throwResourceNotFoundException_when_cardDoesNotExist() {
        assertThatThrownBy(() -> cardService.getById(999999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Card not found with id: 999999");
    }

    @Test
    @DisplayName("save should persist new Card entity and assign generated ID")
    void save_should_persistAndReturnCard_when_cardIsValid() {
        Card newCard = new Card();
        newCard.setName("ServiceTest Dark Magician");
        newCard.setType(CardType.NORMAL_MONSTER);
        newCard.setFrameType(FrameType.NORMAL);
        newCard.setDescription("Ultimate wizard.");
        newCard.setRace(CardRace.SPELLCASTER);
        newCard.setAttribute(CardAttribute.DARK);
        newCard.setAtk(2500);
        newCard.setDef(2100);
        newCard.setLevel(7);

        Card saved = cardService.save(newCard);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("ServiceTest Dark Magician");

        Optional<Card> fetched = cardRepository.findById(saved.getId());
        assertThat(fetched).isPresent();
    }

    @Test
    @DisplayName("edit should update properties of existing Card entity in database")
    void edit_should_updateExistingCard_when_invoked() {
        testCard.setName("ServiceTest Blue-Eyes Updated");
        Card updated = cardService.edit(testCard);
        assertThat(updated.getName()).isEqualTo("ServiceTest Blue-Eyes Updated");

        Card fetched = cardRepository.findById(testCard.getId()).orElseThrow();
        assertThat(fetched.getName()).isEqualTo("ServiceTest Blue-Eyes Updated");
    }

    @Test
    @DisplayName("deleteById should remove card when card exists in database")
    void deleteById_should_removeCard_when_cardExists() {
        Long id = testCard.getId();
        assertThat(cardRepository.existsById(id)).isTrue();

        cardService.deleteById(id);

        assertThat(cardRepository.existsById(id)).isFalse();
    }

    @Test
    @DisplayName("deleteById should throw ResourceNotFoundException when card does not exist")
    void deleteById_should_throwResourceNotFoundException_when_cardDoesNotExist() {
        assertThatThrownBy(() -> cardService.deleteById(999999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
