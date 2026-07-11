package com.deck.lab.backend.seeder;

import java.util.Optional;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;

import jakarta.annotation.PreDestroy;

/**
 * Component orchestrating the initial database seeding sequence during
 * application startup.
 *
 * <p>
 * <strong>Spring Boot Startup Hooks &amp; Non-Blocking Seeding:</strong>
 * </p>
 * <ul>
 * <li>{@link CommandLineRunner}: A callback interface provided by Spring Boot.
 * Beans implementing this interface have their {@code run} method invoked
 * automatically after the application context is fully loaded.</li>
 * <li>To prevent blocking the startup thread (which could cause port binding or
 * health check timeouts on environments like GCP Cloud Run), card and banlist
 * seeding are offloaded to an asynchronous task executor
 * ({@code databaseSeederExecutor}).</li>
 * </ul>
 *
 * <p>
 * <strong>Programmatic Transaction Management:</strong>
 * </p>
 * <p>
 * Uses {@link TransactionTemplate} to manage transactions programmatically,
 * ensuring
 * that seeding users, importing cards, and writing sample decks occur in
 * isolated,
 * controlled transactional scopes.
 * </p>
 *
 * <p>
 * <strong>Seeding Pipeline Phases:</strong>
 * <ol>
 * <li><strong>Users:</strong> Seeds default administration and test users
 * synchronously.</li>
 * <li><strong>Cards:</strong> Initiates asynchronous API data fetching and
 * mappings via {@link CardImporter}. Remote card artwork is concurrently queued
 * to {@code imageDownloadExecutor} (throttled gracefully via CallerRunsPolicy).
 * Mapped cards are written to the database in transactional batches of
 * 500.</li>
 * <li><strong>Banlists &amp; Formats:</strong> Resolves legality constraints
 * (Forbidden, Limited, Semi-Limited) for OCG/TCG formats from the API.</li>
 * <li><strong>Historical Formats:</strong> Configures static classic formats
 * (Goat, Edison, Tengu Plant, HAT) from local parameters.</li>
 * <li><strong>Sample Decks:</strong> Generates starter decks for seeded
 * users.</li>
 * </ol>
 * </p>
 *
 * <p>
 * <strong>Graceful Shutdown &amp; Interruption:</strong>
 * </p>
 * <p>
 * When the container receives a termination signal (e.g., SIGTERM during Cloud
 * Run scale-down or redeployments), the {@code @PreDestroy} shutdown hook calls
 * {@code cancel(true)} on the running {@code Future<?>} task. This immediately
 * interrupts the seeder thread, which checks
 * {@code Thread.currentThread().isInterrupted()} between phases and during card
 * import batch loops to exit cleanly.
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
    private final ThreadPoolTaskExecutor databaseSeederExecutor;

    private Future<?> seedingTask;

    @Value("${app.seed.cards:true}")
    private boolean seedCardsEnabled;

    @Value("${app.seed.users:true}")
    private boolean seedUsersEnabled;

    public DatabaseSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PlatformTransactionManager transactionManager,
            CardImporter cardImporter,
            BanlistImporter banlistImporter,
            DeckSeeder deckSeeder,
            ThreadPoolTaskExecutor databaseSeederExecutor) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.cardImporter = cardImporter;
        this.banlistImporter = banlistImporter;
        this.deckSeeder = deckSeeder;
        this.databaseSeederExecutor = databaseSeederExecutor;
    }

    /**
     * Shutdown hook executed when the Spring context is destroyed.
     * Cancels any active background seeding tasks.
     */
    @PreDestroy
    public void shutdown() {
        logger.info("DatabaseSeeder shutdown initiated. Cancelling seeding task...");
        if (seedingTask != null) {
            seedingTask.cancel(true);
        }
    }

    /**
     * Executes the user and database seeding process upon application startup.
     *
     * @param args command-line arguments
     * @throws Exception if seeding encounters an error
     */
    @Override
    public void run(String... args) throws Exception {
        if (seedCardsEnabled) {
            seedingTask = databaseSeederExecutor.submit(() -> {
                try {
                    logger.info("Starting background database seeding...");
                    cardImporter.seedCardsFromApi();

                    if (Thread.currentThread().isInterrupted()) {
                        logger.info("Database seeder interrupted before seeding banlists. Exiting.");
                        return;
                    }
                    banlistImporter.seedBanlistsFromApi();

                    if (Thread.currentThread().isInterrupted()) {
                        logger.info("Database seeder interrupted before seeding historical banlists. Exiting.");
                        return;
                    }
                    banlistImporter.seedHistoricalBanlists();

                    if (Thread.currentThread().isInterrupted()) {
                        logger.info("Database seeder interrupted before seeding users. Exiting.");
                        return;
                    }
                    if (seedUsersEnabled) {
                        transactionTemplate.executeWithoutResult(status -> {
                            seedUser("admin", "12345678", "admin@example.com");
                            seedUser("yugi", "12345678", "yugi@example.com");
                        });
                    } else {
                        logger.info("User seeding is disabled (app.seed.users=false). Skipping.");
                    }

                    if (Thread.currentThread().isInterrupted()) {
                        logger.info("Database seeder interrupted before seeding sample decks. Exiting.");
                        return;
                    }
                    transactionTemplate.executeWithoutResult(status -> {
                        deckSeeder.seedSampleDecks();
                    });
                    logger.info("Background database seeding completed successfully.");
                } catch (Exception e) {
                    logger.error("Error during background database seeding", e);
                }
            });
        } else {
            logger.info("Card seeding is disabled (app.seed.cards=false). Skipping.");
            if (seedUsersEnabled) {
                transactionTemplate.executeWithoutResult(status -> {
                    seedUser("admin", "12345678", "admin@example.com");
                    seedUser("yugi", "12345678", "yugi@example.com");
                });
            } else {
                logger.info("User seeding is disabled (app.seed.users=false). Skipping.");
            }
            transactionTemplate.executeWithoutResult(status -> {
                deckSeeder.seedSampleDecks();
            });
        }
    }

    private void seedUser(String username, String password, String email) {
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isEmpty()) {
            User user = new User(username, passwordEncoder.encode(password), email);
            userRepository.save(user);
        }
    }
}
