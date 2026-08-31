package com.deck.lab.backend.seeder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;

import com.deck.lab.backend.config.properties.SeederProperties;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("DatabaseSeeder Unit Tests")
class DatabaseSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PlatformTransactionManager transactionManager;

    @Mock
    private CardImporter cardImporter;

    @Mock
    private BanlistImporter banlistImporter;

    @Mock
    private DeckSeeder deckSeeder;

    @Mock
    private ThreadPoolTaskExecutor databaseSeederExecutor;

    private SeederProperties seederProperties;
    private DatabaseSeeder databaseSeeder;

    @BeforeEach
    void setUp() {
        seederProperties = new SeederProperties();
        databaseSeeder = new DatabaseSeeder(
                userRepository,
                passwordEncoder,
                transactionManager,
                cardImporter,
                banlistImporter,
                deckSeeder,
                databaseSeederExecutor,
                seederProperties);
    }

    @Test
    @DisplayName("run should seed default users when seedUsers is enabled and seedCards is disabled")
    void run_should_seedUsers_when_seedUsersEnabled() throws Exception {
        // Arrange
        seederProperties.setUsers(true);
        seederProperties.setCards(false);

        when(transactionManager.getTransaction(any())).thenReturn(new SimpleTransactionStatus());
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // Act
        databaseSeeder.run();

        // Assert
        verify(userRepository).findByUsername("admin");
        verify(userRepository).findByUsername("yugi");
        verify(userRepository, times(2)).save(any(User.class));
    }

    @Test
    @DisplayName("run should not seed users when seedUsers is disabled")
    void run_should_notSeedUsers_when_seedUsersDisabled() throws Exception {
        // Arrange
        seederProperties.setUsers(false);
        seederProperties.setCards(false);

        // Act
        databaseSeeder.run();

        // Assert
        verify(userRepository, never()).findByUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("run should execute card, banlist, user, and deck seeding in correct order when seedCards is enabled")
    void run_should_executeSeedingInCorrectOrder_when_seedCardsEnabled() throws Exception {
        // Arrange
        seederProperties.setUsers(true);
        seederProperties.setCards(true);

        // Mock executor to run tasks synchronously
        when(databaseSeederExecutor.submit(any(Runnable.class))).thenAnswer(invocation -> {
            Runnable runnable = invocation.getArgument(0);
            runnable.run();
            return null;
        });

        when(transactionManager.getTransaction(any())).thenReturn(new SimpleTransactionStatus());
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // Act
        databaseSeeder.run();

        // Assert / Verify call order
        org.mockito.InOrder inOrder = org.mockito.Mockito
                .inOrder(cardImporter, banlistImporter, userRepository, deckSeeder);
        inOrder.verify(cardImporter).seedCardsFromApi();
        inOrder.verify(banlistImporter).seedBanlistsFromApi();
        inOrder.verify(banlistImporter).seedHistoricalBanlists();
        inOrder.verify(userRepository).findByUsername("admin");
        inOrder.verify(userRepository).findByUsername("yugi");
        inOrder.verify(deckSeeder).seedSampleDecks();
    }
}
