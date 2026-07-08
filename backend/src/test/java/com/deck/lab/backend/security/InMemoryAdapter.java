package com.deck.lab.backend.security;

/**
 * Test implementation of the {@link RefreshTokenCookieAdapter} interface.
 *
 * <p>
 * <strong>Mock Double Pattern (InMemory Cookie Capture)</strong>
 * </p>
 * <p>
 * Captures token states in-memory during testing cycles. Allows controller
 * integration tests to assert cookie creation and invalidation payloads without
 * requiring full HTTP servlet header parsing.
 * </p>
 */
public class InMemoryAdapter implements RefreshTokenCookieAdapter {

    private String lastCookie = null;

    @Override
    public String createCookie(String token) {
        this.lastCookie = token;
        return "refreshToken=" + token + "; Path=/api/auth; HttpOnly; Secure; SameSite=Lax";
    }

    @Override
    public String clearCookie() {
        this.lastCookie = "";
        return "refreshToken=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
    }

    /**
     * Gets the last set cookie token value.
     */
    public String getLastCookie() {
        return lastCookie;
    }
}
