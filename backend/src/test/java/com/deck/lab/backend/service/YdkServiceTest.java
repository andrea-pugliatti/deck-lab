package com.deck.lab.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.YdkImportResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.UserRepository;

@SpringBootTest
@Transactional
@DisplayName("YdkService Integration Tests")
class YdkServiceTest {

    @Autowired
    private YdkService ydkService;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private UserRepository userRepository;

    private Card card1;
    private Card card2;
    private Card card3;

    @BeforeEach
    void setUp() {
        card1 = new Card("Ydk Test Card 1", CardType.NORMAL_MONSTER, FrameType.NORMAL,
                "The ultimate wizard", CardRace.SPELLCASTER, CardAttribute.DARK,
                "Dark Magician", "img1.jpg", "crop1.jpg", 2500, 2100, 7, null, null);
        card1.setPasscode(46986414L);
        card1 = cardRepository.save(card1);

        card2 = new Card("Ydk Test Card 2", CardType.SYNCHRO_MONSTER, FrameType.SYNCHRO,
                "A dragon", CardRace.DRAGON, CardAttribute.WIND,
                "Stardust", "img2.jpg", "crop2.jpg", 2500, 2000, 8, null, null);
        card2.setPasscode(83755611L);
        card2 = cardRepository.save(card2);

        card3 = new Card("Ydk Test Card 3", CardType.EFFECT_MONSTER, FrameType.EFFECT,
                "Handtrap", CardRace.ZOMBIE, CardAttribute.FIRE,
                "Ghost Girl", "img3.jpg", "crop3.jpg", 0, 1800, 3, null, null);
        card3.setPasscode(14558127L);
        card3 = cardRepository.save(card3);
    }

    @Test
    @DisplayName("importYdk should parse valid YDK structure into main, extra, and side sections with aggregated quantities")
    void importYdk_should_parseSectionsAndQuantities_when_contentIsValid() {
        String ydkContent = """
                #created by DeckLab
                #main
                46986414
                46986414
                46986414
                #extra
                83755611
                !side
                14558127
                """;

        YdkImportResponseDto result = ydkService.importYdk(ydkContent);

        assertThat(result).isNotNull();
        assertThat(result.getDeck()).isNotNull();
        assertThat(result.getWarnings()).isEmpty();

        List<DeckCardResponseDto> cards = result.getDeck().getCards();
        assertThat(cards).hasSize(3);

        DeckCardResponseDto mainCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.MAIN)
                .findFirst()
                .orElseThrow();
        assertThat(mainCard.getName()).isEqualTo("Ydk Test Card 1");
        assertThat(mainCard.getQuantity()).isEqualTo(3);

        DeckCardResponseDto extraCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.EXTRA)
                .findFirst()
                .orElseThrow();
        assertThat(extraCard.getName()).isEqualTo("Ydk Test Card 2");
        assertThat(extraCard.getQuantity()).isEqualTo(1);

        DeckCardResponseDto sideCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.SIDE)
                .findFirst()
                .orElseThrow();
        assertThat(sideCard.getName()).isEqualTo("Ydk Test Card 3");
        assertThat(sideCard.getQuantity()).isEqualTo(1);
    }

    @Test
    @DisplayName("importYdk should log warning for unknown or unresolvable card passcodes")
    void importYdk_should_recordWarning_when_passcodeIsUnresolved() {
        String ydkContent = """
                #main
                46986414
                99999999
                """;

        YdkImportResponseDto result = ydkService.importYdk(ydkContent);

        assertThat(result).isNotNull();
        assertThat(result.getWarnings()).hasSize(1);
        assertThat(result.getWarnings().get(0)).contains("99999999");
    }

    @Test
    @DisplayName("exportYdk should format deck cards into YDK file specification string")
    void exportYdk_should_returnYdkFormattedString_when_deckExists() {
        User user = new User("ydk_user", "password", "ydk_user@example.com");
        user = userRepository.save(user);

        Deck deck = new Deck("Export Test Deck", "Description", Format.TCG, user);
        deck.getDeckCards().add(new DeckCard(deck, card1, DeckSection.MAIN, 3));
        deck.getDeckCards().add(new DeckCard(deck, card2, DeckSection.EXTRA, 1));
        deck.getDeckCards().add(new DeckCard(deck, card3, DeckSection.SIDE, 1));
        deck = deckRepository.save(deck);

        String exportedYdk = ydkService.exportYdk(deck.getId());

        assertThat(exportedYdk)
                .contains("#created by DeckLab")
                .contains("#main")
                .contains("46986414")
                .contains("#extra")
                .contains("83755611")
                .contains("!side")
                .contains("14558127");
    }
}
