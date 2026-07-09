package com.deck.lab.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Implementation of the {@link RefreshTokenCookieAdapter} interface.
 *
 * <p>
 * <strong>ResponseCookie Adapter</strong>
 * </p>
 * <p>
 * Translates cookie generation and clearing operations into standard, secure
 * {@link ResponseCookie} headers. Centralizes cookie configuration attributes
 * (HttpOnly, Secure, SameSite, and Path) to ensure consistency across all
 * session management endpoints.
 * </p>
 */
@Component
public class HttpCookieAdapter implements RefreshTokenCookieAdapter {

    private final long maxAgeSeconds;
    private final String sameSite;
    private final boolean secure;

    public HttpCookieAdapter(
            @Value("${refresh-token.duration-days:7}") int durationDays,
            @Value("${app.cookie.same-site:Lax}") String sameSite,
            @Value("${app.cookie.secure:true}") boolean secure) {
        this.maxAgeSeconds = durationDays * 24 * 60 * 60L;
        this.sameSite = sameSite;
        this.secure = secure;
    }

    @Override
    public String createCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/auth")
                .maxAge(maxAgeSeconds)
                .build()
                .toString();
    }

    @Override
    public String clearCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/auth")
                .maxAge(0)
                .build()
                .toString();
    }
}
