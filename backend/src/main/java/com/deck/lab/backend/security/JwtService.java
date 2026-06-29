package com.deck.lab.backend.security;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Service managing JSON Web Token (JWT) generation, claims extraction, and
 * signature verification.
 *
 * <p>
 * <strong>Utility Helper (Stateless Security Token Provider)</strong>
 * </p>
 * <p>
 * This class encapsulates the JJWT library implementation. JWTs enable
 * stateless authentication: instead of keeping track of sessions in server
 * memory, the server serializes user properties (such as email/username) into a
 * token payload. Downstream requests read these values directly from the token,
 * eliminating database lookups on every request.
 * </p>
 *
 * <p>
 * <strong>JWT Structure & Security Explained:</strong>
 * </p>
 * <ul>
 * <li><strong>Anatomy:</strong>
 * A JWT consists of three parts separated by dots: Header (metadata like
 * algorithm), Payload (the claims packet), and Signature (cryptographic
 * verification hash).</li>
 * <li><strong>Cryptographic Signature:</strong>
 * To prevent clients from spoofing their identities (e.g. changing their email
 * from 'user@test.com' to 'admin@test.com'), the token is signed using a secret
 * HMAC key (via {@code HMAC-SHA}). If any part of the payload is modified, the
 * signature check fails, rejecting the request immediately.</li>
 * <li><strong>Claims:</strong>
 * Custom key-value pairs stored in the token body. This service extracts
 * general user properties (subjects, issued dates, and expirations) from these
 * claims during validation.</li>
 * </ul>
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Helper to decode the base64-encoded secret and generate a HMAC signing key.
     */
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a new access token valid for the configured duration.
     *
     * @param email the user email to set as JWT subject
     * @return the serialized JWT string
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the subject (email) from a token.
     *
     * @param token the JWT token string
     * @return the subject email string
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Decrypts and extracts claims from a signature-verified JWT token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Validates if a token matches the logged-in UserDetails and has not expired.
     *
     * @param token       the JWT token to validate
     * @param userDetails the UserDetails context of the authenticated user
     * @return true if valid and matching, false if expired, mutated, or mismatched
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String email = extractUsername(token);
            String userEmail = userDetails instanceof User
                    ? ((User) userDetails).getEmail()
                    : userDetails.getUsername();
            return (email.equals(userEmail) && !isTokenExpired(token));
        } catch (ExpiredJwtException e) {
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Checks if the token's expiration date is prior to the current system time.
     */
    private boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            return true;
        }
    }
}
