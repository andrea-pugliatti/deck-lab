package com.deck.lab.backend.service;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.dto.request.LoginRequestDto;
import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.dto.response.AuthResponseDto;
import com.deck.lab.backend.dto.response.TokenRefreshResponseDto;
import com.deck.lab.backend.mapper.UserMapper;
import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.UserRepository;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RefreshTokenService;

/**
 * Service orchestrating user login authentication, account registration, token
 * rotation, and logout.
 *
 * <p>
 * <strong>Service Layer (Domain Logic Facade)</strong>
 * </p>
 * <p>
 * In a standard layered architecture, the Service Layer contains the system's
 * business rules. This class coordinates various security subsystems:
 * validating credentials via Spring Security's {@link AuthenticationManager},
 * hashing plaintext passwords using {@link PasswordEncoder} before persistence,
 * registering users in {@link UserRepository}, and issuing session credentials
 * by collaborating with {@link JwtService} and {@link RefreshTokenService}.
 * </p>
 *
 * <p>
 * <strong>Spring Framework Concepts:</strong>
 * </p>
 * <ul>
 * <li>{@code @Service}: A specialized stereotype annotation designating this
 * class as a service bean. Spring's component scanner automatically discovers
 * it and instantiates it as a singleton in the Application Context, enabling
 * dependency injection wherever needed.</li>
 * <li>BCrypt Password Hashing: Plaintext passwords must never be stored. We
 * inject a {@code PasswordEncoder} (configured as BCrypt) which applies a
 * secure one-way salted hashing function to passwords prior to database
 * insertion.</li>
 * </ul>
 */
@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userMapper = userMapper;
    }

    /**
     * Authenticates login credentials. On success, generates a short-lived access
     * JWT and a persistent database-backed refresh token.
     *
     * @param loginRequest the username and password credentials
     * @return Optional containing AuthResponseDto if authenticated, or empty
     *         Optional if failed
     */
    public Optional<AuthResponseDto> login(LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            return Optional.of(new AuthResponseDto(token, refreshToken.getToken(), user.getUsername()));
        } catch (AuthenticationException e) {
            return Optional.empty();
        }
    }

    /**
     * Registers a new user account if the username/email are unique.
     * Encrypts the password and generates the first session tokens.
     *
     * @param registerRequest the new user registration details
     * @return Optional containing AuthResponseDto, or empty Optional if user
     *         already exists
     */
    public Optional<AuthResponseDto> register(RegisterRequestDto registerRequest) {
        if (userRepository.findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail())
                .isPresent()) {
            return Optional.empty();
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = userMapper.toEntity(registerRequest, encodedPassword);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return Optional.of(new AuthResponseDto(token, refreshToken.getToken(), user.getUsername()));
    }

    /**
     * Rotates/refreshes the user's session tokens. Generates a new access token
     * and invalidates/rotates the current refresh token.
     *
     * @param refreshToken the current valid refresh token string
     * @return TokenRefreshResponseDto containing new access and rotated refresh
     *         token
     * @throws TokenRefreshException if token validation fails
     */
    public TokenRefreshResponseDto refresh(String refreshToken) {
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);
        String accessToken = jwtService.generateToken(newRefreshToken.getUser().getEmail());

        return new TokenRefreshResponseDto(accessToken, newRefreshToken.getToken());
    }

    /**
     * Revokes a refresh token session, effectively logging out the user's
     * device/session.
     *
     * @param refreshToken the refresh token string to revoke
     */
    public void revoke(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }
}
