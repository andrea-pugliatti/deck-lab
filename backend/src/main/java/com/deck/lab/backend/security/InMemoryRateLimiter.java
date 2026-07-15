package com.deck.lab.backend.security;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * In-memory rate limiter implementation of the {@link RateLimiter} interface.
 *
 * <p>
 * <strong>Sliding Time-Window Rate Limiting Strategy</strong>
 * </p>
 * <p>
 * Extends the rate-limiting contract by tracking request frequencies per IP address inside a
 * thread-safe {@link ConcurrentHashMap}. It tracks attempts within a sliding time window and
 * automatically rejects requests exceeding configure thresholds.
 * </p>
 */
public class InMemoryRateLimiter implements RateLimiter {

    private final int maxAttempts;
    private final long windowMs;
    private final ConcurrentMap<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    public InMemoryRateLimiter(int maxAttempts, long windowMs) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    /**
     * Checks if the request limit for the given key (e.g. client IP) is exceeded. Increments the
     * attempt counter and throws {@link ResponseStatusException} with HTTP 429 status code if the
     * threshold is violated.
     *
     * @param key the unique identifier to rate limit (typically client IP address)
     */
    @Override
    public void checkLimit(String key) {
        long now = System.currentTimeMillis();
        RateLimitInfo info = rateLimitMap.compute(key, (k, v) -> {
            if (v == null || (now - v.windowStart) > windowMs) {
                return new RateLimitInfo(1, now);
            } else {
                v.attempts++;
                return v;
            }
        });

        if (info.attempts > maxAttempts) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many requests. Please try again later.");
        }
    }

    /**
     * Purges expired rate limit entries from memory.
     */
    public void cleanup() {
        long now = System.currentTimeMillis();
        rateLimitMap.entrySet().removeIf(entry -> (now - entry.getValue().windowStart) > windowMs);
    }

    /**
     * Resets rate-limiting logs (used primarily for test scenarios).
     */
    public void reset() {
        rateLimitMap.clear();
    }

    /**
     * Internal container storing rate limit data for a single client IP address.
     */
    private static class RateLimitInfo {
        int attempts;
        long windowStart;

        RateLimitInfo(int attempts, long windowStart) {
            this.attempts = attempts;
            this.windowStart = windowStart;
        }
    }
}
