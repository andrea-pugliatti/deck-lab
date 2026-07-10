package com.deck.lab.backend.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.RateLimiter;

/**
 * Spring configuration registering rate limiting strategies and scheduling task
 * sweeps.
 *
 * <p>
 * Configures distinct, named beans for rate limiting different routes:
 * <ul>
 * <li>{@code tokenRefreshRateLimiter}: Applied to session refresh
 * endpoints.</li>
 * <li>{@code aiGenerationRateLimiter}: Applied to AI generation endpoints.</li>
 * <li>{@code loginRateLimiter}: Applied to authentication login endpoints.</li>
 * <li>{@code registerRateLimiter}: Applied to authentication registration
 * endpoints.</li>
 * <li>{@code deckValidationRateLimiter}: Applied to deck validation
 * endpoints.</li>
 * <li>{@code deckSaveRateLimiter}: Applied to deck creation and update
 * endpoints.</li>
 * </ul>
 * Also schedules a background cleanup daemon to sweep stale rate limit records
 * from memory, preventing memory leaks over time.
 * </p>
 */
@Configuration
public class RateLimitConfig {

    private final List<InMemoryRateLimiter> limiters = new ArrayList<>();

    /**
     * Creates a rate limiter bean for token refresh requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("tokenRefreshRateLimiter")
    public RateLimiter tokenRefreshRateLimiter(
            @Value("${refresh-token.rate-limit.max-attempts:5}") int maxAttempts,
            @Value("${refresh-token.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Creates a rate limiter bean for AI deck generation requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("aiGenerationRateLimiter")
    public RateLimiter aiGenerationRateLimiter(
            @Value("${ai-generation.rate-limit.max-attempts:3}") int maxAttempts,
            @Value("${ai-generation.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Creates a rate limiter bean for login authentication requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("loginRateLimiter")
    public RateLimiter loginRateLimiter(
            @Value("${auth.login.rate-limit.max-attempts:10}") int maxAttempts,
            @Value("${auth.login.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Creates a rate limiter bean for registration requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("registerRateLimiter")
    public RateLimiter registerRateLimiter(
            @Value("${auth.register.rate-limit.max-attempts:5}") int maxAttempts,
            @Value("${auth.register.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Creates a rate limiter bean for deck validation requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("deckValidationRateLimiter")
    public RateLimiter deckValidationRateLimiter(
            @Value("${deck.validate.rate-limit.max-attempts:15}") int maxAttempts,
            @Value("${deck.validate.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Creates a rate limiter bean for deck save/update requests.
     *
     * @param maxAttempts maximum attempts allowed in the window
     * @param windowMs    time window size in milliseconds
     * @return the rate limiter instance
     */
    @Bean("deckSaveRateLimiter")
    public RateLimiter deckSaveRateLimiter(
            @Value("${deck.save.rate-limit.max-attempts:5}") int maxAttempts,
            @Value("${deck.save.rate-limit.window-ms:60000}") long windowMs) {
        InMemoryRateLimiter limiter = new InMemoryRateLimiter(maxAttempts, windowMs);
        limiters.add(limiter);
        return limiter;
    }

    /**
     * Periodically purges expired rate limit entries from all registered rate
     * limiters.
     */
    @Scheduled(cron = "${rate-limit.cleanup-schedule:0 */5 * * * *}")
    public void cleanupExpiredEntries() {
        for (InMemoryRateLimiter limiter : limiters) {
            limiter.cleanup();
        }
    }
}
