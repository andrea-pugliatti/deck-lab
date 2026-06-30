package com.deck.lab.backend.dto.response;

/**
 * Data Transfer Object (DTO) containing refreshed JWT tokens returned to the
 * client.
 *
 * <p>
 * <strong>Response DTO</strong>
 * </p>
 * <p>
 * This object encapsulates a new short-lived JWT Access Token along with a
 * refreshed long-lived Refresh Token. Bundling this within a custom payload
 * allows the frontend client to seamlessly update its local storage state and
 * maintain an authenticated session without forcing the user to log back in
 * with their password.
 * </p>
 */
public class TokenRefreshResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public TokenRefreshResponseDto() {
    }

    public TokenRefreshResponseDto(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
