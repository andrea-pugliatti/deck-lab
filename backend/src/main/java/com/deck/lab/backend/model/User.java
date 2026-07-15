package com.deck.lab.backend.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Domain model entity representing a registered system user.
 *
 * <p>
 * <strong>JPA Entity integrated with Spring Security UserDetails</strong>
 * </p>
 * <p>
 * This entity maps user registration records to the {@code users} table. To integrate seamlessly
 * with Spring Security, it implements the {@link UserDetails} interface. This allows Spring
 * Security to treat the entity directly as a principal object during authentication, verifying
 * passwords, retrieving roles, and checking account status without requiring separate security
 * wrapper adapters.
 * </p>
 *
 * <p>
 * <strong>Spring Security Interface Methods:</strong>
 * </p>
 * <ul>
 * <li>{@code getAuthorities()}: Maps database or default user roles to Spring Security's
 * {@link org.springframework.security.core.GrantedAuthority} instances (e.g.
 * {@code ROLE_USER}).</li>
 * <li>{@code isAccountNonExpired()}, {@code isAccountNonLocked()},
 * {@code isCredentialsNonExpired()}, and {@code isEnabled()}: Represent account state flags. In
 * this implementation, they return {@code true} to specify accounts are active and unlocked.</li>
 * </ul>
 */
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    public User() {
    }

    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
