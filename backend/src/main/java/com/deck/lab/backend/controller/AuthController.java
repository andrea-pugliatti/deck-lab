package com.deck.lab.backend.controller;

import com.deck.lab.backend.dto.request.LoginRequestDto;
import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.dto.response.AuthResponseDto;
import com.deck.lab.backend.dto.response.TokenRefreshResponseDto;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RefreshTokenService;
import com.deck.lab.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.deck.lab.backend.exception.TokenRefreshException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user.getEmail());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Lax")
                    .path("/api/auth")
                    .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponseDto(token, refreshToken.getToken(), user.getUsername()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        User user = new User(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponseDto(token, refreshToken.getToken(), user.getUsername()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletRequest servletRequest) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new TokenRefreshException("", "Refresh token is missing from cookie!");
        }

        String ipAddress = servletRequest.getRemoteAddr();
        refreshTokenService.checkRateLimit(ipAddress);

        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);
        String accessToken = jwtService.generateToken(newRefreshToken.getUser().getEmail());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new TokenRefreshResponseDto(accessToken, newRefreshToken.getToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(0) // delete cookie
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
