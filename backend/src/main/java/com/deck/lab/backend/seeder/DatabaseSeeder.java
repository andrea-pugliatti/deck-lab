package com.deck.lab.backend.seeder;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;

/**
 * Component orchestrating the initial database seeding sequence during
 * application startup.
 *
 * <p>
 * <strong>Spring Boot Startup Hooks:</strong>
 * </p>
 * <ul>
 * <li>{@link CommandLineRunner}: A callback interface provided by Spring Boot.
 * Beans implementing this interface have their {@code run} method invoked
 * automatically after the application context is fully loaded and before the
 * startup sequence finishes. This makes it ideal for bootstrap tasks like
 * verification and database seeding.</li>
 * </ul>
 *
 * <p>
 * <strong>Programmatic Transaction Management:</strong>
 * </p>
 * <p>
 * Instead of declarative {@code @Transactional} annotations, this class uses
 * {@link TransactionTemplate} to manage transactions programmatically. This
 * ensures that seeding users, importing cards, and writing sample decks occur
 * in isolated, controlled transactional scopes, preventing bulk seeding errors
 * from corrupting partial database elements.
 * </p>
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;
    private final CardImporter cardImporter;
    private final BanlistImporter banlistImporter;
    private final DeckSeeder deckSeeder;

    @Value("${app.seed.cards:true}")
    private boolean seedCardsEnabled;

    public DatabaseSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PlatformTransactionManager transactionManager,
            CardImporter cardImporter,
            BanlistImporter banlistImporter,
            DeckSeeder deckSeeder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.cardImporter = cardImporter;
        this.banlistImporter = banlistImporter;
        this.deckSeeder = deckSeeder;
    }

    @Override
    public void run(String... args) throws Exception {
        transactionTemplate.executeWithoutResult(status -> {
            seedUser("admin", "12345678", "admin@example.com");
            seedUser("yugi", "12345678", "yugi@example.com");
        });

        if (seedCardsEnabled) {
            cardImporter.seedCardsFromApi();
            banlistImporter.seedBanlistsFromApi();
            banlistImporter.seedHistoricalBanlists();
        } else {
            logger.info("Card seeding is disabled (app.seed.cards=false). Skipping.");
        }

        transactionTemplate.executeWithoutResult(status -> {
            deckSeeder.seedSampleDecks();
        });
    }

    private void seedUser(String username, String password, String email) {
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isEmpty()) {
            User user = new User(username, passwordEncoder.encode(password), email);
            userRepository.save(user);
        }
    }
}
