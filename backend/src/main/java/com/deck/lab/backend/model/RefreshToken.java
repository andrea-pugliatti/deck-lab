package com.deck.lab.backend.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

/**
 * Domain model entity representing a persistent refresh token used for session management.
 *
 * <p>
 * <strong>Persistent Refresh Token (JWT Session Store)</strong>
 * </p>
 * <p>
 * Short-lived JWT access tokens are stateless and cannot be easily revoked. To maintain security,
 * we issue short-lived access tokens along with long-lived refresh tokens. This entity maps refresh
 * token records to the {@code refresh_tokens} table, storing them in the database to enable token
 * tracking.
 * </p>
 *
 * <p>
 * <strong>Security Benefits of Database Tracking:</strong>
 * </p>
 * <ul>
 * <li><strong>Revocation:</strong> Setting {@code revoked = true} allows immediate invalidation of
 * user sessions (e.g., during logout or password changes), blocking subsequent requests to generate
 * new access tokens.</li>
 * <li><strong>Token Rotation:</strong> Tracking fields like {@code rotatedAt} and {@code token}
 * uniqueness enables token rotation policies. If a token is used multiple times or reused after
 * rotation, it can indicate a token theft/replay attack, allowing the system to flag and revoke the
 * entire session.</li>
 * <li><strong>Expiration:</strong> {@code expiryDate} checks are evaluated before issuing new
 * access tokens to enforce absolute session timeouts.</li>
 * </ul>
 *
 * <p>
 * <strong>JPA Configuration:</strong>
 * </p>
 * <ul>
 * <li>{@code @ManyToOne(fetch = FetchType.LAZY)}: Connects the token to a single {@link User}. We
 * lazy-load the user record to save query overhead during token validation cycles.</li>
 * </ul>
 */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    private Instant expiryDate;

    @NotNull
    private boolean revoked;

    @NotNull
    private Instant createdAt;

    private Instant rotatedAt;

    public RefreshToken() {
        this.createdAt = Instant.now();
    }

    public RefreshToken(String token, User user, Instant expiryDate, boolean revoked) {
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
        this.revoked = revoked;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getRotatedAt() {
        return rotatedAt;
    }

    public void setRotatedAt(Instant rotatedAt) {
        this.rotatedAt = rotatedAt;
    }
}
