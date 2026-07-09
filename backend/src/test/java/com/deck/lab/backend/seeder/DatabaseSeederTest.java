package com.deck.lab.backend.seeder;

import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.test.util.ReflectionTestUtils;

import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
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

    private DatabaseSeeder databaseSeeder;

    @BeforeEach
    void setUp() {
        databaseSeeder = new DatabaseSeeder(
                userRepository,
                passwordEncoder,
                transactionManager,
                cardImporter,
                banlistImporter,
                deckSeeder
        );
    }

    @Test
    void whenSeedUsersEnabled_thenSeedsUsers() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(databaseSeeder, "seedUsersEnabled", true);
        ReflectionTestUtils.setField(databaseSeeder, "seedCardsEnabled", false);
        
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
    void whenSeedUsersDisabled_thenDoesNotSeedUsers() throws Exception {
        // Arrange
        ReflectionTestUtils.setField(databaseSeeder, "seedUsersEnabled", false);
        ReflectionTestUtils.setField(databaseSeeder, "seedCardsEnabled", false);

        // Act
        databaseSeeder.run();

        // Assert
        verify(userRepository, never()).findByUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}
