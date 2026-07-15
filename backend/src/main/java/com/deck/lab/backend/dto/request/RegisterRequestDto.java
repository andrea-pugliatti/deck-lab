package com.deck.lab.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload Data Transfer Object (DTO) containing registration details for creating a new
 * user account.
 *
 * <p>
 * <strong>Request DTO</strong>
 * </p>
 * <p>
 * This object defines the data inputs needed to register a new user in the system. Separating
 * registration input logic from the database {@link User} model ensures that fields such as user
 * roles, active status, or creation timestamps cannot be manipulated by client-submitted payloads.
 * </p>
 */
public class RegisterRequestDto {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    public RegisterRequestDto() {
    }

    public RegisterRequestDto(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
