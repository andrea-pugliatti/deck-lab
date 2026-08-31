package com.deck.lab.backend.seeder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.web.client.RestClient;

import com.deck.lab.backend.config.properties.YgoProDeckProperties;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardAttribute;
import com.deck.lab.backend.model.CardRace;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.model.FrameType;
import com.deck.lab.backend.repository.CardRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Unit tests for {@link CardImporter}.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CardImporter Unit Tests")
class CardImporterTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private PlatformTransactionManager transactionManager;

    @Mock
    private Executor imageDownloadExecutor;

    private ObjectMapper objectMapper;
    private RestClient.Builder restClientBuilder;
    private MockRestServiceServer mockServer;
    private YgoProDeckProperties properties;
    private CardImporter cardImporter;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        restClientBuilder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(restClientBuilder).ignoreExpectOrder(true).build();

        properties = new YgoProDeckProperties();
        properties.setApiUrl("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        properties.setBatchSize(500);
        properties.setConnectTimeout(5000);
        properties.setReadTimeout(5000);

        cardImporter = new CardImporter(
                cardRepository,
                transactionManager,
                imageDownloadExecutor,
                objectMapper,
                restClientBuilder,
                properties);
    }

    @Test
    @DisplayName("constructor should properly initialize CardImporter with injected dependencies")
    void constructor_should_initializeDependencies() {
        assertThat(cardImporter).isNotNull();
    }

    @Test
    @DisplayName("mapApiResponseToCard should accurately map monster card attributes and queue image downloads")
    void mapApiResponseToCard_should_mapMonsterCard_when_validPayload() {
        // Arrange
        Map<String, Object> apiCard = Map.ofEntries(
                Map.entry("id", 46986414),
                Map.entry("name", "Dark Magician"),
                Map.entry("type", "Normal Monster"),
                Map.entry("desc", "The ultimate wizard in terms of attack and defense."),
                Map.entry("race", "Spellcaster"),
                Map.entry("attribute", "DARK"),
                Map.entry("archetype", "Dark Magician"),
                Map.entry("frameType", "normal"),
                Map.entry("atk", 2500),
                Map.entry("def", 2100),
                Map.entry("level", 7),
                Map.entry("card_images", List.of(
                        Map.of(
                                "image_url", "https://images.ygoprodeck.com/images/cards/46986414.jpg",
                                "image_url_cropped", "https://images.ygoprodeck.com/images/cards_cropped/46986414.jpg"
                        )
                ))
        );

        // Act
        Card card = cardImporter.mapApiResponseToCard(apiCard);

        // Assert
        assertThat(card).isNotNull();
        assertThat(card.getName()).isEqualTo("Dark Magician");
        assertThat(card.getType()).isEqualTo(CardType.NORMAL_MONSTER);
        assertThat(card.getFrameType()).isEqualTo(FrameType.NORMAL);
        assertThat(card.getRace()).isEqualTo(CardRace.SPELLCASTER);
        assertThat(card.getAttribute()).isEqualTo(CardAttribute.DARK);
        assertThat(card.getArchetype()).isEqualTo("Dark Magician");
        assertThat(card.getAtk()).isEqualTo(2500);
        assertThat(card.getDef()).isEqualTo(2100);
        assertThat(card.getLevel()).isEqualTo(7);
        assertThat(card.getPasscode()).isEqualTo(46986414L);
        assertThat(card.getImageUrl()).isEqualTo("cards/images/46986414.jpg");
        assertThat(card.getImageUrlCropped()).isEqualTo("cards/images/cropped/46986414.jpg");
        
        verify(imageDownloadExecutor, atLeastOnce()).execute(any(Runnable.class));
    }

    @Test
    @DisplayName("mapApiResponseToCard should accurately map Link and Pendulum monster attributes")
    void mapApiResponseToCard_should_mapSpecialMonsterTypes_when_linkOrPendulum() {
        // Arrange
        Map<String, Object> linkCard = Map.of(
                "id", 5043010L,
                "name", "Decode Talker",
                "type", "Link Monster",
                "frameType", "link",
                "race", "Cyberse",
                "attribute", "DARK",
                "atk", 2300,
                "linkval", 3
        );

        // Act
        Card card = cardImporter.mapApiResponseToCard(linkCard);

        // Assert
        assertThat(card).isNotNull();
        assertThat(card.getName()).isEqualTo("Decode Talker");
        assertThat(card.getType()).isEqualTo(CardType.LINK_MONSTER);
        assertThat(card.getFrameType()).isEqualTo(FrameType.LINK);
        assertThat(card.getLinkVal()).isEqualTo(3);
        assertThat(card.getAtk()).isEqualTo(2300);
        assertThat(card.getDef()).isNull();
    }

    @Test
    @DisplayName("mapApiResponseToCard should return null when id is missing")
    void mapApiResponseToCard_should_returnNull_when_idMissing() {
        Map<String, Object> invalidCard = Map.of(
                "name", "Nameless Card",
                "type", "Spell Card"
        );

        Card card = cardImporter.mapApiResponseToCard(invalidCard);

        assertThat(card).isNull();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    @DisplayName("mapApiResponseToCard should return null when name is empty or blank")
    void mapApiResponseToCard_should_returnNull_when_nameBlank(String blankName) {
        Map<String, Object> invalidCard = Map.of(
                "id", 12345,
                "name", blankName,
                "type", "Spell Card"
        );

        Card card = cardImporter.mapApiResponseToCard(invalidCard);

        assertThat(card).isNull();
    }

    @Test
    @DisplayName("mapApiResponseToCard should return null when card type is invalid or unknown")
    void mapApiResponseToCard_should_returnNull_when_unknownType() {
        Map<String, Object> invalidCard = Map.of(
                "id", 12345,
                "name", "Unknown Type Card",
                "type", "NonExistentCardType"
        );

        Card card = cardImporter.mapApiResponseToCard(invalidCard);

        assertThat(card).isNull();
    }

    @Test
    @DisplayName("fetchAllCards should fetch cards with pagination until batch limit is reached")
    void fetchAllCards_should_retrieveCardsWithPagination() {
        // Arrange
        String page1Json = """
                {
                    "data": [
                        {
                            "id": 1001,
                            "name": "Card One",
                            "type": "Spell Card",
                            "frameType": "spell",
                            "race": "Normal"
                        },
                        {
                            "id": 1002,
                            "name": "Card Two",
                            "type": "Trap Card",
                            "frameType": "trap",
                            "race": "Normal"
                        }
                    ]
                }
                """;
        String page2Json = """
                {
                    "data": [
                        {
                            "id": 1003,
                            "name": "Card Three",
                            "type": "Normal Monster",
                            "frameType": "normal",
                            "race": "Dragon",
                            "attribute": "LIGHT",
                            "atk": 3000,
                            "def": 2500,
                            "level": 8
                        }
                    ]
                }
                """;

        mockServer.expect(requestTo("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=2&offset=0"))
                .andRespond(withSuccess(page1Json, MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=2&offset=2"))
                .andRespond(withSuccess(page2Json, MediaType.APPLICATION_JSON));

        // Act
        List<Card> cards = cardImporter.fetchAllCards(properties.getApiUrl(), 2, 5000, 5000);

        // Assert
        mockServer.verify();
        assertThat(cards).hasSize(3);
        assertThat(cards.get(0).getName()).isEqualTo("Card One");
        assertThat(cards.get(1).getName()).isEqualTo("Card Two");
        assertThat(cards.get(2).getName()).isEqualTo("Card Three");
    }

    @Test
    @DisplayName("fetchAllCards should return empty list when API response contains no data")
    void fetchAllCards_should_returnEmpty_when_noDataInResponse() {
        mockServer.expect(requestTo("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=10&offset=0"))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        List<Card> cards = cardImporter.fetchAllCards(properties.getApiUrl(), 10, 5000, 5000);

        mockServer.verify();
        assertThat(cards).isEmpty();
    }

    @Test
    @DisplayName("seedCardsFromApi should skip full seeding and check images when database has more than 100 cards")
    void seedCardsFromApi_should_skipSeeding_when_databaseAlreadyPopulated() {
        // Arrange
        when(cardRepository.count()).thenReturn(150L);
        when(cardRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        cardImporter.seedCardsFromApi();

        // Assert
        verify(cardRepository).count();
        verify(cardRepository).findAll();
        verify(cardRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("seedCardsFromApi should seed cards from local JSON resource when database has <= 100 cards")
    void seedCardsFromApi_should_seedCards_when_databaseEmpty() {
        // Arrange
        when(cardRepository.count()).thenReturn(0L);
        when(cardRepository.findAll()).thenReturn(Collections.emptyList());
        when(transactionManager.getTransaction(any())).thenReturn(new SimpleTransactionStatus());

        // Act
        cardImporter.seedCardsFromApi();

        // Assert
        verify(cardRepository).count();
        verify(cardRepository, atLeastOnce()).saveAll(any());
    }
}
