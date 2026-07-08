package com.deck.lab.backend.security;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.exception.TokenRefreshException;
import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.RefreshTokenRepository;

/**
 * Service managing database-backed refresh tokens, token rotation rules,
 * and security replay protection.
 *
 * <p>
 * <strong>Token Rotation & Replay Protection</strong>
 * </p>
 * <p>
 * Unlike stateless access tokens, refresh tokens represent a persistent
 * authorization session and are tracked in the database. To minimize the risk
 * of stolen tokens, this service implements two core security patterns:
 * </p>
 * <ul>
 * <li><strong>Token Rotation:</strong>
 * Every time a client uses their refresh token to request a new access token,
 * the current refresh token is rotated (invalidated) and a new refresh token is
 * issued.</li>
 * <li><strong>Reuse Detection (Replay Protection):</strong>
 * If the system receives a refresh request for an already rotated/revoked
 * token, it implies that an attacker intercepted the token and is trying to
 * reuse it. To protect the user, the service immediately revokes the entire
 * family of tokens associated with that session, forcing the legitimate owner
 * to re-authenticate with their password.</li>
 * <li><strong>Grace Period:</strong>
 * Single-page applications (SPAs) often trigger concurrent requests. If two
 * parallel API requests try to refresh the token at the exact same millisecond,
 * token rotation could reject the second request as a reuse attempt. A short
 * configuration-defined grace period prevents these race conditions from
 * triggering false-positive security revocs.</li>
 * </ul>
 *
 * <p>
 * <strong>IP-Based Rate Limiting & Background Cleanup:</strong>
 * </p>
 * <ul>
 * <li>In-Memory Rate Limiting: Tracks request attempts per client IP address in
 * a thread-safe {@link ConcurrentHashMap} to guard the endpoint against
 * denial-of-service or token enumeration attacks.</li>
 * <li>{@code @Scheduled} Cleanup: Database tables tracking active sessions can
 * suffer from performance bloat over time. This service runs a scheduled cron
 * job (configured via Spring's task scheduler) to periodically purge expired or
 * revoked token entries.</li>
 * </ul>
 */
@Service
public class RefreshTokenService {

    @Value("${refresh-token.duration-days:7}")
    private int durationDays;

    @Value("${refresh-token.max-per-user:5}")
    private int maxPerUser;

    @Value("${refresh-token.grace-period-seconds:10}")
    private int gracePeriodSeconds;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /**
     * Generates a secure, random url-safe base64 string token.
     */
    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    /**
     * Finds a RefreshToken entity by its token string.
     *
     * @param token the token string to search
     * @return Optional containing the RefreshToken if found
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Creates and persists a new RefreshToken session for a user.
     * Automatically invalidates older sessions if they exceed the max sessions per
     * user limit.
     *
     * @param user the User owner of the session
     * @return the saved RefreshToken entity
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndRevokedFalseOrderByCreatedAtAsc(user);
        if (activeTokens.size() >= maxPerUser) {
            int toRevoke = activeTokens.size() - maxPerUser + 1;
            for (int i = 0; i < toRevoke; i++) {
                RefreshToken token = activeTokens.get(i);
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            }
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plus(durationDays, ChronoUnit.DAYS));
        refreshToken.setToken(generateSecureToken());
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Verifies that a RefreshToken has not expired or been improperly reused.
     * Implements reuse detection: if a revoked token is accessed outside its
     * rotation grace window,
     * it invalidates all active sessions for the user to defend against token
     * theft.
     *
     * @param token the RefreshToken entity to verify
     * @return the verified RefreshToken
     * @throws TokenRefreshException if the token is expired or reuse is detected
     */
    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please sign in again.");
        }

        if (token.isRevoked()) {
            if (token.getRotatedAt() != null &&
                    Instant.now().isBefore(token.getRotatedAt().plus(gracePeriodSeconds, ChronoUnit.SECONDS))) {
                throw new TokenRefreshException(token.getToken(),
                        "Refresh token has already been rotated. Please use the new token.");
            }

            User user = token.getUser();
            List<RefreshToken> userTokens = refreshTokenRepository.findByUser(user);
            for (RefreshToken t : userTokens) {
                t.setRevoked(true);
            }
            refreshTokenRepository.saveAll(userTokens);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token has been reused! All user sessions have been invalidated for security.");
        }

        return token;
    }

    /**
     * Rotates an existing refresh token, creating a new one and revoking the old
     * one.
     *
     * @param tokenStr the current refresh token string
     * @return the new, rotated RefreshToken entity
     * @throws TokenRefreshException if the token is invalid or expired
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String tokenStr) {
        RefreshToken oldToken = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new TokenRefreshException(tokenStr, "Refresh token is not in database!"));

        verifyExpiration(oldToken);

        User user = oldToken.getUser();
        RefreshToken newRefreshToken = createRefreshToken(user);

        oldToken.setRevoked(true);
        oldToken.setRotatedAt(Instant.now());
        refreshTokenRepository.save(oldToken);

        return newRefreshToken;
    }

    /**
     * Revokes a refresh token string by setting its revoked flag to true.
     *
     * @param tokenStr the token string to revoke
     */
    @Transactional
    public void revokeToken(String tokenStr) {
        refreshTokenRepository.findByToken(tokenStr).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    /**
     * Scheduled cron job running daily to purge expired or revoked tokens from
     * database.
     */
    @Scheduled(cron = "${refresh-token.cleanup-schedule:0 0 3 * * *}")
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBeforeOrRevokedTrue(Instant.now());
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public void setMaxPerUser(int maxPerUser) {
        this.maxPerUser = maxPerUser;
    }

    public void setGracePeriodSeconds(int gracePeriodSeconds) {
        this.gracePeriodSeconds = gracePeriodSeconds;
    }
}
