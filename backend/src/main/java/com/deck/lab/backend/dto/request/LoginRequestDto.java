package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload Data Transfer Object (DTO) containing credentials for user
 * authentication.
 *
 * <p>
 * <strong>Request DTO</strong>
 * </p>
 * <p>
 * This class encapsulates the login credentials (username and password) sent by
 * the client. Decoupling user login inputs from the database {@link User}
 * entity is critical: it ensures that database-only properties (like password
 * salt or internal metadata) cannot be accidentally bound from user inputs,
 * preventing "mass assignment" security vulnerabilities.
 * </p>
 */
public class LoginRequestDto {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequestDto() {
    }

    public LoginRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
