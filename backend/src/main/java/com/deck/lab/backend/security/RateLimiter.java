package com.deck.lab.backend.security;

import org.springframework.web.server.ResponseStatusException;

/**
 * Interface defining the execution contract for client-level request rate limiters.
 *
 * <p>
 * <strong>Strategy Pattern (Rate Limiting Abstraction)</strong>
 * </p>
 * <p>
 * This interface establishes a unified contract for rate limiting. By referencing this contract,
 * web controllers and services can assert limits without knowing anything about the implementation.
 * </p>
 */
public interface RateLimiter {

    /**
     * Asserts that a client identifier has not exceeded rate limiting constraints. Throws an HTTP
     * 429 exception if constraints are violated.
     *
     * @param key the unique identifier for the rate-limiting bucket (such as remote client IP)
     * @throws ResponseStatusException HTTP 429 Too Many Requests if limit is exceeded
     */
    void checkLimit(String key);
}
