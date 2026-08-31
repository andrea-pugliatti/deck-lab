package com.deck.lab.backend.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.request.DeckSaveRequestDto;
import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;

@DisplayName("DeckMapper Unit Tests")
class DeckMapperTest {

    private DeckMapper deckMapper;

    @BeforeEach
    void setUp() {
        deckMapper = new DeckMapper();
    }

    @Test
    @DisplayName("toDto should map valid Deck and associated DeckCards into DeckResponseDto")
    void toDto_should_mapAllFields_when_deckAndCardsAreValid() {
        User user = new User("yugi", "password", "yugi@example.com");
        user.setId(1L);

        Deck deck = new Deck();
        deck.setId(10L);
        deck.setName("Yugi's Starter Deck");
        deck.setDescription("A deck loaded with powerful spellcasters and dragons.");
        deck.setFormatName(Format.TCG);
        deck.setUser(user);

        Card card1 = new Card();
        card1.setId(100L);
        card1.setName("Dark Magician");
        card1.setType(CardType.NORMAL_MONSTER);
        card1.setDescription("The ultimate wizard in terms of attack and defense.");
        card1.setRace(CardRace.SPELLCASTER);
        card1.setAttribute(CardAttribute.DARK);
        card1.setArchetype("Dark Magician");
        card1.setImageUrl("cards/images/100.jpg");

        Card card2 = new Card();
        card2.setId(101L);
        card2.setName("Blue-Eyes White Dragon");
        card2.setType(CardType.NORMAL_MONSTER);
        card2.setDescription("This legendary dragon is a powerful engine of destruction.");
        card2.setRace(CardRace.DRAGON);
        card2.setAttribute(CardAttribute.LIGHT);
        card2.setArchetype("Blue-Eyes");
        card2.setImageUrl("cards/images/101.jpg");

        DeckCard dc1 = new DeckCard(deck, card1, DeckSection.MAIN, 3);
        dc1.setId(500L);

        DeckCard dc2 = new DeckCard(deck, card2, DeckSection.SIDE, 1);
        dc2.setId(501L);

        deck.setDeckCards(List.of(dc1, dc2));

        DeckResponseDto dto = deckMapper.toDto(deck);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(deck.getId());
        assertThat(dto.getName()).isEqualTo(deck.getName());
        assertThat(dto.getDescription()).isEqualTo(deck.getDescription());
        assertThat(dto.getFormatName()).isEqualTo(deck.getFormatName());
        assertThat(dto.getCreatorUsername()).isEqualTo("yugi");

        List<DeckCardResponseDto> cardDtos = dto.getCards();
        assertThat(cardDtos).isNotNull().hasSize(2);

        DeckCardResponseDto cardDto1 = cardDtos.stream()
                .filter(c -> c.getCardId().equals(100L))
                .findFirst()
                .orElseThrow();
        assertThat(cardDto1.getId()).isEqualTo(500L);
        assertThat(cardDto1.getName()).isEqualTo("Dark Magician");
        assertThat(cardDto1.getType()).isEqualTo(CardType.NORMAL_MONSTER);
        assertThat(cardDto1.getDescription()).isEqualTo("The ultimate wizard in terms of attack and defense.");
        assertThat(cardDto1.getRace()).isEqualTo(CardRace.SPELLCASTER);
        assertThat(cardDto1.getAttribute()).isEqualTo(CardAttribute.DARK);
        assertThat(cardDto1.getArchetype()).isEqualTo("Dark Magician");
        assertThat(cardDto1.getImageUrl()).isEqualTo("cards/images/100.jpg");
        assertThat(cardDto1.getSection()).isEqualTo(DeckSection.MAIN);
        assertThat(cardDto1.getQuantity()).isEqualTo(3);

        DeckCardResponseDto cardDto2 = cardDtos.stream()
                .filter(c -> c.getCardId().equals(101L))
                .findFirst()
                .orElseThrow();
        assertThat(cardDto2.getId()).isEqualTo(501L);
        assertThat(cardDto2.getName()).isEqualTo("Blue-Eyes White Dragon");
        assertThat(cardDto2.getRace()).isEqualTo(CardRace.DRAGON);
        assertThat(cardDto2.getAttribute()).isEqualTo(CardAttribute.LIGHT);
        assertThat(cardDto2.getArchetype()).isEqualTo("Blue-Eyes");
        assertThat(cardDto2.getImageUrl()).isEqualTo("cards/images/101.jpg");
        assertThat(cardDto2.getSection()).isEqualTo(DeckSection.SIDE);
        assertThat(cardDto2.getQuantity()).isEqualTo(1);
    }

    @Test
    @DisplayName("toDto should return DeckResponseDto with empty card list when deck has no cards")
    void toDto_should_returnDtoWithEmptyList_when_deckCardsEmpty() {
        Deck deck = new Deck("Empty Deck", "No cards inside", Format.SPEED_DUEL, null);
        deck.setId(20L);
        deck.setDeckCards(new ArrayList<>());

        DeckResponseDto dto = deckMapper.toDto(deck);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(20L);
        assertThat(dto.getName()).isEqualTo("Empty Deck");
        assertThat(dto.getDescription()).isEqualTo("No cards inside");
        assertThat(dto.getFormatName()).isEqualTo(Format.SPEED_DUEL);
        assertThat(dto.getCards()).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("toEntity should map all DeckSaveRequestDto fields into Deck entity")
    void toEntity_should_mapFields_when_dtoIsValid() {
        DeckSaveRequestDto dto = new DeckSaveRequestDto();
        dto.setName("New Deck");
        dto.setDescription("Some description");
        dto.setFormatName(Format.GOAT);

        Deck deck = deckMapper.toEntity(dto);

        assertThat(deck).isNotNull();
        assertThat(deck.getName()).isEqualTo("New Deck");
        assertThat(deck.getDescription()).isEqualTo("Some description");
        assertThat(deck.getFormatName()).isEqualTo(Format.GOAT);
    }

    @Test
    @DisplayName("toEntity should return null when DTO is null")
    void toEntity_should_returnNull_when_dtoIsNull() {
        assertThat(deckMapper.toEntity((DeckSaveRequestDto) null)).isNull();
    }

    @Test
    @DisplayName("updateEntityFromDto should update existing Deck fields while preserving ID")
    void updateEntityFromDto_should_updateFields_when_dtoAndDeckProvided() {
        Deck deck = new Deck("Old Name", "Old Desc", Format.TCG, null);
        deck.setId(40L);

        DeckSaveRequestDto dto = new DeckSaveRequestDto();
        dto.setName("Updated Name");
        dto.setDescription("Updated Desc");
        dto.setFormatName(Format.GOAT);

        deckMapper.updateEntityFromDto(dto, deck);

        assertThat(deck.getId()).isEqualTo(40L); // ID should not be changed by updateEntityFromDto
        assertThat(deck.getName()).isEqualTo("Updated Name");
        assertThat(deck.getDescription()).isEqualTo("Updated Desc");
        assertThat(deck.getFormatName()).isEqualTo(Format.GOAT);
    }

    @Test
    @DisplayName("toDeckCardDto should map DeckCard and underlying Card entity into DeckCardResponseDto")
    void toDeckCardDto_should_mapAllFields_when_deckCardIsValid() {
        Deck deck = new Deck();
        deck.setId(1L);

        Card card = new Card();
        card.setId(10L);
        card.setName("Dark Magician");
        card.setType(CardType.NORMAL_MONSTER);
        card.setDescription("The ultimate wizard.");
        card.setRace(CardRace.SPELLCASTER);
        card.setAttribute(CardAttribute.DARK);
        card.setArchetype("Dark Magician");
        card.setImageUrl("images/10.jpg");

        DeckCard deckCard = new DeckCard(deck, card, DeckSection.MAIN, 3);
        deckCard.setId(100L);

        DeckCardResponseDto dto = deckMapper.toDeckCardDto(deckCard);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(100L);
        assertThat(dto.getCardId()).isEqualTo(10L);
        assertThat(dto.getName()).isEqualTo("Dark Magician");
        assertThat(dto.getType()).isEqualTo(CardType.NORMAL_MONSTER);
        assertThat(dto.getDescription()).isEqualTo("The ultimate wizard.");
        assertThat(dto.getRace()).isEqualTo(CardRace.SPELLCASTER);
        assertThat(dto.getAttribute()).isEqualTo(CardAttribute.DARK);
        assertThat(dto.getArchetype()).isEqualTo("Dark Magician");
        assertThat(dto.getImageUrl()).isEqualTo("images/10.jpg");
        assertThat(dto.getSection()).isEqualTo(DeckSection.MAIN);
        assertThat(dto.getQuantity()).isEqualTo(3);
    }

    @Test
    @DisplayName("toDeckCardDto should handle null card reference gracefully")
    void toDeckCardDto_should_mapWithoutCardInfo_when_cardIsNull() {
        DeckCard deckCard = new DeckCard(null, null, DeckSection.SIDE, 1);
        deckCard.setId(200L);

        DeckCardResponseDto dto = deckMapper.toDeckCardDto(deckCard);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(200L);
        assertThat(dto.getCardId()).isNull();
        assertThat(dto.getName()).isNull();
        assertThat(dto.getSection()).isEqualTo(DeckSection.SIDE);
        assertThat(dto.getQuantity()).isEqualTo(1);
    }

    @Test
    @DisplayName("toDeckCardDto should return null when DeckCard is null")
    void toDeckCardDto_should_returnNull_when_deckCardIsNull() {
        assertThat(deckMapper.toDeckCardDto(null)).isNull();
    }
}
