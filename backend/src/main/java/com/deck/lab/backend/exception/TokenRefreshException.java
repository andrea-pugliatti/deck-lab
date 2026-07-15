package com.deck.lab.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom runtime exception thrown when session refresh token verification fails.
 *
 * <p>
 * <b>ResponseStatus Annotation:</b> Configured with {@link ResponseStatus} mapping to
 * {@code 403 FORBIDDEN}. If a token is expired, mutated, or reused, the application interrupts
 * execution and returns a clean HTTP Forbidden status code, forcing clients to redirect users back
 * to the authentication screen.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class TokenRefreshException extends RuntimeException {
    public TokenRefreshException(String token, String message) {
        super(String.format("Failed for [%s]: %s", token, message));
    }
}
