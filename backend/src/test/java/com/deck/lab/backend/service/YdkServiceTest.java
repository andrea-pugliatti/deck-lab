package com.deck.lab.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
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
    void importYdk_validContent_parsesSectionsAndQuantities() {
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

        assertNotNull(result);
        assertNotNull(result.getDeck());
        assertTrue(result.getWarnings().isEmpty());

        List<DeckCardResponseDto> cards = result.getDeck().getCards();
        assertEquals(3, cards.size());

        DeckCardResponseDto mainCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.MAIN)
                .findFirst()
                .orElseThrow();
        assertEquals("Ydk Test Card 1", mainCard.getName());
        assertEquals(3, mainCard.getQuantity());

        DeckCardResponseDto extraCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.EXTRA)
                .findFirst()
                .orElseThrow();
        assertEquals("Ydk Test Card 2", extraCard.getName());
        assertEquals(1, extraCard.getQuantity());

        DeckCardResponseDto sideCard = cards.stream()
                .filter(c -> c.getSection() == DeckSection.SIDE)
                .findFirst()
                .orElseThrow();
        assertEquals("Ydk Test Card 3", sideCard.getName());
        assertEquals(1, sideCard.getQuantity());
    }

    @Test
    void importYdk_unresolvedPasscode_returnsWarning() {
        String ydkContent = """
                #main
                46986414
                99999999
                """;

        YdkImportResponseDto result = ydkService.importYdk(ydkContent);

        assertNotNull(result);
        assertEquals(1, result.getWarnings().size());
        assertTrue(result.getWarnings().get(0).contains("99999999"));
    }

    @Test
    void exportYdk_validDeckId_returnsYdkFormattedString() {
        User user = new User("ydk_user", "password", "ydk_user@example.com");
        user = userRepository.save(user);

        Deck deck = new Deck("Export Test Deck", "Description", Format.TCG, user);
        deck.getDeckCards().add(new DeckCard(deck, card1, DeckSection.MAIN, 3));
        deck.getDeckCards().add(new DeckCard(deck, card2, DeckSection.EXTRA, 1));
        deck.getDeckCards().add(new DeckCard(deck, card3, DeckSection.SIDE, 1));
        deck = deckRepository.save(deck);

        String exportedYdk = ydkService.exportYdk(deck.getId());

        assertTrue(exportedYdk.contains("#created by DeckLab"));
        assertTrue(exportedYdk.contains("#main"));
        assertTrue(exportedYdk.contains("46986414"));
        assertTrue(exportedYdk.contains("#extra"));
        assertTrue(exportedYdk.contains("83755611"));
        assertTrue(exportedYdk.contains("!side"));
        assertTrue(exportedYdk.contains("14558127"));
    }
}
