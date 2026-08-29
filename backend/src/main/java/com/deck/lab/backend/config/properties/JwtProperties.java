package com.deck.lab.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for JSON Web Token (JWT) generation, validation, and expiration.
 *
 * <p>
 * Binds properties prefixed with {@code jwt} from application configuration sources.
 * </p>
 */
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Secret HMAC key used for signing and verifying JWT tokens.
     */
    private String secret = "ejM4YTNjNWQ3ZTkxYmI4Y2U5Mzg1NzlkMmVkMjE5ODk5ZjhkMDgxODg0YzdkNjU5YTJmZWFhMGM1NWFkMDE1YTNmZjRmMWIyYjBiODIyY2QxNWQ2YzE1YjBmMDBhMDg=";

    /**
     * Expiration duration in milliseconds for generated access tokens. Default is 900,000 ms (15 minutes).
     */
    private long expiration = 900000L;

    /**
     * Returns the HMAC secret key.
     *
     * @return the HMAC secret key
     */
    public String getSecret() {
        return secret;
    }

    /**
     * Sets the HMAC secret key.
     *
     * @param secret the secret HMAC signing key
     */
    public void setSecret(String secret) {
        this.secret = secret;
    }

    /**
     * Returns the token expiration duration in milliseconds.
     *
     * @return the expiration duration in milliseconds
     */
    public long getExpiration() {
        return expiration;
    }

    /**
     * Sets the token expiration duration in milliseconds.
     *
     * @param expiration the token expiration duration in milliseconds
     */
    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}
