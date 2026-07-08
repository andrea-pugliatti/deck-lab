package com.deck.lab.backend.security;

/**
 * Interface defining the execution contract for building and clearing refresh
 * token HTTP cookies.
 *
 * <p>
 * <strong>Adapter Pattern (Cookie Header Abstraction)</strong>
 * </p>
 * <p>
 * Decouples the API controllers from raw servlet header formatting. By defining
 * a clean boundary for cookie creation and revocation, the system allows
 * swapping production headers ({@code Set-Cookie} values) for simple in-memory
 * strings during automated testing.
 * </p>
 */
public interface RefreshTokenCookieAdapter {

    /**
     * Constructs a cookie header string containing the refresh token.
     *
     * @param token the refresh token value
     * @return the formatted cookie header string
     */
    String createCookie(String token);

    /**
     * Constructs a cookie header string that clears/invalidates the refresh token.
     *
     * @return the formatted cookie header string with clear instruction
     */
    String clearCookie();
}
