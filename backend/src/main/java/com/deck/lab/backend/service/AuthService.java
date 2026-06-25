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

    public TokenRefreshResponseDto refresh(String refreshToken) {
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);
        String accessToken = jwtService.generateToken(newRefreshToken.getUser().getEmail());

        return new TokenRefreshResponseDto(accessToken, newRefreshToken.getToken());
    }

    public void revoke(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }
}
