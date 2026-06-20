package com.deck.lab.backend.security;

import com.deck.lab.backend.exception.TokenRefreshException;
import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class RefreshTokenService {

    @Value("${refresh-token.duration-days:7}")
    private int durationDays;

    @Value("${refresh-token.max-per-user:5}")
    private int maxPerUser;

    private final RefreshTokenRepository refreshTokenRepository;
    private final ConcurrentMap<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Enforce max-per-user concurrent sessions limit
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
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please sign in again.");
        }

        if (token.isRevoked()) {
            // REUSE DETECTION ANOMALY: Invalidate all active tokens for this user!
            User user = token.getUser();
            List<RefreshToken> userTokens = refreshTokenRepository.findByUser(user);
            for (RefreshToken t : userTokens) {
                t.setRevoked(true);
            }
            refreshTokenRepository.saveAll(userTokens);
            throw new TokenRefreshException(token.getToken(), "Refresh token has been reused! All user sessions have been invalidated for security.");
        }

        return token;
    }

    @Transactional
    public RefreshToken rotateRefreshToken(String tokenStr) {
        RefreshToken oldToken = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new TokenRefreshException(tokenStr, "Refresh token is not in database!"));

        verifyExpiration(oldToken);

        User user = oldToken.getUser();
        RefreshToken newRefreshToken = createRefreshToken(user);

        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        return newRefreshToken;
    }

    @Transactional
    public void revokeToken(String tokenStr) {
        refreshTokenRepository.findByToken(tokenStr).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Scheduled(cron = "${refresh-token.cleanup-schedule:0 0 3 * * *}")
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBeforeOrRevokedTrue(Instant.now());
    }

    public void checkRateLimit(String ipAddress) {
        long now = System.currentTimeMillis();
        RateLimitInfo info = rateLimitMap.compute(ipAddress, (k, v) -> {
            if (v == null || (now - v.lastAttemptTime) > 60000) { // 1 minute window
                return new RateLimitInfo(1, now);
            } else {
                v.attempts++;
                v.lastAttemptTime = now;
                return v;
            }
        });

        if (info.attempts > 5) { // Max 5 requests per minute
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many refresh attempts. Please try again later.");
        }
    }

    public void resetRateLimits() {
        rateLimitMap.clear();
    }

    // Setters for test environment overrides
    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public void setMaxPerUser(int maxPerUser) {
        this.maxPerUser = maxPerUser;
    }

    private static class RateLimitInfo {
        int attempts;
        long lastAttemptTime;

        RateLimitInfo(int attempts, long lastAttemptTime) {
            this.attempts = attempts;
            this.lastAttemptTime = lastAttemptTime;
        }
    }
}
