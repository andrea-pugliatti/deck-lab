package com.deck.lab.backend.dto.response;

/**
 * Data Transfer Object (DTO) representing the response payload returned upon
 * successful user authentication.
 *
 * <p>
 * <strong>Response DTO</strong>
 * </p>
 * <p>
 * This object wraps authentication credentials (JWT access token and refresh
 * token) along with username details to deliver them securely to client
 * applications. By packaging the tokens within a structured JSON response
 * entity, we avoid using non-standard HTTP header configurations and maintain a
 * standardized API boundary contract.
 * </p>
 */
public class AuthResponseDto {

    private String accessToken;
    private String refreshToken;
    private String username;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String accessToken, String refreshToken, String username) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
    }

    public AuthResponseDto(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public AuthResponseDto(String accessToken) {
        this.accessToken = accessToken;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return accessToken;
    }

    public void setToken(String token) {
        this.accessToken = token;
    }
}
