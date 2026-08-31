package com.deck.lab.backend.seeder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.web.client.RestClient;

import com.deck.lab.backend.config.properties.YgoProDeckProperties;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardStatus;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Unit tests for {@link BanlistImporter}.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("BanlistImporter Unit Tests")
class BanlistImporterTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private FormatRulesRepository formatRulesRepository;

    @Mock
    private PlatformTransactionManager transactionManager;

    private ObjectMapper objectMapper;
    private RestClient.Builder restClientBuilder;
    private YgoProDeckProperties properties;
    private BanlistImporter banlistImporter;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        restClientBuilder = RestClient.builder();

        properties = new YgoProDeckProperties();
        properties.setApiUrl("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        properties.setBatchSize(500);
        properties.setConnectTimeout(5000);
        properties.setReadTimeout(5000);

        banlistImporter = new BanlistImporter(
                cardRepository,
                formatRulesRepository,
                transactionManager,
                objectMapper,
                restClientBuilder,
                properties);
    }

    @Test
    @DisplayName("constructor should properly initialize BanlistImporter with injected dependencies")
    void constructor_should_initializeDependencies() {
        assertThat(banlistImporter).isNotNull();
    }

    @Test
    @DisplayName("seedBanlistsFromApi should skip seeding format when format rules already exist")
    void seedBanlistsFromApi_should_skipFormat_when_alreadySeeded() {
        // Arrange
        when(formatRulesRepository.findByFormatName(any(Format.class)))
                .thenReturn(List.of(new FormatRules(Format.TCG, new Card(), CardStatus.FORBIDDEN)));

        // Act
        banlistImporter.seedBanlistsFromApi();

        // Assert
        verify(cardRepository, never()).findAll();
        verify(formatRulesRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("seedBanlistsFromApi should seed banlist rules when formats are unseeded")
    void seedBanlistsFromApi_should_seedBanlists_when_formatUnseeded() {
        // Arrange
        when(formatRulesRepository.findByFormatName(any(Format.class)))
                .thenReturn(Collections.emptyList());
        when(transactionManager.getTransaction(any())).thenReturn(new SimpleTransactionStatus());

        Card potOfGreed = new Card();
        potOfGreed.setName("Pot of Greed");
        when(cardRepository.findAll()).thenReturn(List.of(potOfGreed));

        // Act
        banlistImporter.seedBanlistsFromApi();

        // Assert
        verify(formatRulesRepository, atLeastOnce()).findByFormatName(any(Format.class));
    }

    @Test
    @DisplayName("seedHistoricalBanlists should skip seeding historical formats when rules already exist")
    void seedHistoricalBanlists_should_skip_when_alreadySeeded() {
        // Arrange
        when(formatRulesRepository.findByFormatName(any(Format.class)))
                .thenReturn(
                        List.of(new FormatRules(Format.EDISON, new Card(), CardStatus.FORBIDDEN)));

        // Act
        banlistImporter.seedHistoricalBanlists();

        // Assert
        verify(cardRepository, never()).findByName(any());
        verify(formatRulesRepository, never()).save(any(FormatRules.class));
    }

    @Test
    @DisplayName("seedHistoricalBanlists should seed historical format rules when format rules are empty")
    void seedHistoricalBanlists_should_seedRules_when_formatsEmpty() {
        // Arrange
        when(formatRulesRepository.findByFormatName(any(Format.class)))
                .thenReturn(Collections.emptyList());

        Card sampleCard = new Card();
        sampleCard.setName("Pot of Greed");
        when(cardRepository.findByName(any())).thenReturn(Optional.of(sampleCard));

        // Act
        banlistImporter.seedHistoricalBanlists();

        // Assert
        verify(formatRulesRepository, atLeastOnce()).findByFormatName(any(Format.class));
        verify(formatRulesRepository, atLeastOnce()).save(any(FormatRules.class));
    }

    @Test
    @DisplayName("seedHistoricalBanlists should gracefully skip rules when card is not found in database")
    void seedHistoricalBanlists_should_skipMissingCard_when_cardNotFound() {
        // Arrange
        when(formatRulesRepository.findByFormatName(any(Format.class)))
                .thenReturn(Collections.emptyList());
        when(cardRepository.findByName(any())).thenReturn(Optional.empty());

        // Act
        banlistImporter.seedHistoricalBanlists();

        // Assert
        verify(formatRulesRepository, atLeastOnce()).findByFormatName(any(Format.class));
        verify(formatRulesRepository, never()).save(any(FormatRules.class));
    }
}
