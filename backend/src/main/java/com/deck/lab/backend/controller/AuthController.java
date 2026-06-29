package com.deck.lab.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deck.lab.backend.dto.request.LoginRequestDto;
import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.dto.response.AuthResponseDto;
import com.deck.lab.backend.dto.response.TokenRefreshResponseDto;
import com.deck.lab.backend.security.RefreshTokenService;
import com.deck.lab.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * REST Controller handling user authentication, session creation, registration,
 * and token management.
 *
 * <p>
 * <strong>Controller (REST API)</strong>
 * </p>
 * <p>
 * In a Layered Architecture, this class acts as a primary adapter (driving
 * adapter) exposing REST APIs to external clients. It delegates business
 * validation and authentication logic to the service layer ({@link AuthService}
 * and {@link RefreshTokenService}), and maps service outputs back into standard
 * HTTP Response Entities.
 * </p>
 *
 * <p>
 * <strong>Spring Annotations & HTTP Concepts:</strong>
 * </p>
 * <ul>
 * <li>{@code @RestController}: A specialized version of <i>@Controller</i> that
 * automatically configures HTTP responses. Every controller method returning an
 * object implicitly serializes the output directly to JSON in the HTTP response
 * body (combining <i>@Controller</i> and <i>@ResponseBody</i>).</li>
 * <li>{@code @RequestMapping("/api/auth")}: Establishes a base URI namespace
 * path. All endpoints defined in this class are prefixed with
 * <i>/api/auth</i>.</li>
 * <li>{@code @PostMapping}: Binds HTTP POST requests to designated methods,
 * conforming to REST conventions for state-changing operations (like logging
 * in, registering, or refreshing tokens).</li>
 * <li>{@code @Valid}: Triggers standard Jakarta Bean Validation on incoming
 * request objects (like {@link LoginRequestDto} or {@link RegisterRequestDto})
 * before invoking the method body.</li>
 * </ul>
 *
 * <p>
 * <strong>HttpOnly & Secure Cookie Session Pattern:</strong>
 * </p>
 * <p>
 * To protect authenticated sessions from Cross-Site Scripting (XSS) attacks,
 * this controller implements a hybrid token delivery strategy:
 * Short-lived JWT Access Tokens are returned in the JSON response body,
 * enabling the client application to use them in standard authorization
 * headers.
 * Long-lived Refresh Tokens are stored inside HTTP cookies configured with
 * {@code HttpOnly}, {@code Secure}, and {@code SameSite=Lax} properties.
 * This prevents client-side JavaScript from accessing the refresh token,
 * protecting sessions from being hijacked if malicious scripts execute in the
 * browser.
 * </p>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${refresh-token.duration-days:7}")
    private int durationDays;

    private final AuthService service;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService service, RefreshTokenService refreshTokenService) {
        this.service = service;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * Authenticates a user with username and password, returning JWT access token
     * and setting the refresh token as an HttpOnly secure cookie.
     *
     * @param loginRequest DTO containing username and password
     * @return 200 OK with AuthResponseDto, or 401 Unauthorized if login fails
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        Optional<AuthResponseDto> authResponse = service.login(loginRequest);
        if (authResponse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AuthResponseDto responseDto = authResponse.get();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        buildRefreshTokenCookie(responseDto.getRefreshToken(), durationDays * 24 * 60 * 60L))
                .body(responseDto);
    }

    /**
     * Registers a new user account, returning JWT access token on success
     * and setting the refresh token as an HttpOnly secure cookie.
     *
     * @param registerRequest DTO containing registration details
     * @return 200 OK with AuthResponseDto, or 400 Bad Request if registration fails
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        Optional<AuthResponseDto> authResponse = service.register(registerRequest);
        if (authResponse.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AuthResponseDto responseDto = authResponse.get();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        buildRefreshTokenCookie(responseDto.getRefreshToken(), durationDays * 24 * 60 * 60L))
                .body(responseDto);
    }

    /**
     * Rotates/refreshes the user session token. Checks rate limiting by client IP,
     * verifies expiration, and returns a new JWT access token and rotated refresh
     * token cookie.
     *
     * @param refreshToken   the current refresh token extracted from HTTP cookie
     * @param servletRequest the raw servlet request to identify remote IP for rate
     *                       limiting
     * @return 200 OK with TokenRefreshResponseDto, or 401 Unauthorized if token is
     *         missing
     * @throws TokenRefreshException   if token is expired, revoked, or reused
     * @throws ResponseStatusException if client exceeds rate limit attempts
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletRequest servletRequest) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String ipAddress = servletRequest.getRemoteAddr();
        refreshTokenService.checkRateLimit(ipAddress);

        TokenRefreshResponseDto responseDto = service.refresh(refreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        buildRefreshTokenCookie(responseDto.getRefreshToken(), durationDays * 24 * 60 * 60L))
                .body(responseDto);
    }

    /**
     * Revokes the current refresh token session and clears the client's refresh
     * token cookie.
     *
     * @param refreshToken the refresh token extracted from HTTP cookie to be
     *                     revoked
     * @return 200 OK with cleared cookie header
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        service.revoke(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildRefreshTokenCookie("", 0))
                .build();
    }

    /**
     * Helper to build a secure HTTP Cookie header for the refresh token.
     */
    private String buildRefreshTokenCookie(String token, long maxAge) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(maxAge)
                .build()
                .toString();
    }
}
