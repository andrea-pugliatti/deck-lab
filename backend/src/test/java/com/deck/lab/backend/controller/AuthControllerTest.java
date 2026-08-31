package com.deck.lab.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.request.LoginRequestDto;
import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.RefreshTokenRepository;
import com.deck.lab.backend.repository.UserRepository;
import com.deck.lab.backend.security.InMemoryAdapter;
import com.deck.lab.backend.security.InMemoryRateLimiter;
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RateLimiter;
import com.deck.lab.backend.security.RefreshTokenCookieAdapter;
import com.deck.lab.backend.security.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("AuthController Integration and Security Tests")
public class AuthControllerTest {

    @TestConfiguration
    public static class TestConfig {
        @Bean
        @Primary
        public RefreshTokenCookieAdapter testCookieAdapter() {
            return new InMemoryAdapter();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    @Qualifier("tokenRefreshRateLimiter")
    private RateLimiter tokenRefreshRateLimiter;

    @Autowired
    @Qualifier("loginRateLimiter")
    private RateLimiter loginRateLimiter;

    @Autowired
    @Qualifier("registerRateLimiter")
    private RateLimiter registerRateLimiter;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        ((InMemoryRateLimiter) tokenRefreshRateLimiter).reset();
        ((InMemoryRateLimiter) loginRateLimiter).reset();
        ((InMemoryRateLimiter) registerRateLimiter).reset();
        testUser = new User("auth-test-user", passwordEncoder.encode("securepassword"),
                "auth-test-email@example.com");
        testUser = userRepository.save(testUser);
    }

    @Test
    @DisplayName("login should succeed and return JWT tokens when credentials are valid")
    void login_should_succeedAndIssueTokens_when_credentialsAreValid() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");

        String responseBody = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(responseBody).get("accessToken").asString();
        String extractedSubject = jwtService.extractUsername(token);
        assertThat(extractedSubject).isEqualTo("auth-test-email@example.com");
    }

    @Test
    @DisplayName("login should return 401 Unauthorized when credentials are invalid")
    void login_should_returnUnauthorized_when_credentialsAreInvalid() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("protected endpoints should require valid JWT token header")
    void accessProtectedResource_should_requireAuthentication() throws Exception {
        mockMvc.perform(post("/api/decks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        String token = jwtService.generateToken(testUser.getEmail());

        mockMvc.perform(post("/api/decks")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("register should succeed and issue tokens when payload is valid")
    void register_should_succeedAndIssueTokens_when_payloadIsValid() throws Exception {
        RegisterRequestDto registerRequest = new RegisterRequestDto("new-user",
                "new-email@example.com",
                "newsecurepassword");

        String responseBody = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(responseBody).get("accessToken").asString();
        String extractedSubject = jwtService.extractUsername(token);
        assertThat(extractedSubject).isEqualTo("new-email@example.com");
    }

    @Test
    @DisplayName("register should fail when username already exists")
    void register_should_fail_when_usernameIsDuplicate() throws Exception {
        RegisterRequestDto registerRequest = new RegisterRequestDto("auth-test-user",
                "new-email-2@example.com",
                "newsecurepassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("register should fail when email already exists")
    void register_should_fail_when_emailIsDuplicate() throws Exception {
        RegisterRequestDto registerRequest = new RegisterRequestDto("new-user-2",
                "auth-test-email@example.com",
                "newsecurepassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("refresh should rotate refresh token and revoke old token")
    void refresh_should_rotateRefreshToken_when_validTokenSupplied() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");

        Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("refreshToken"))
                .andReturn()
                .getResponse()
                .getCookie("refreshToken");

        assertThat(loginCookie).isNotNull();
        String oldRefreshToken = loginCookie.getValue();

        Cookie refreshCookie = mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", oldRefreshToken))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(cookie().exists("refreshToken"))
                .andReturn()
                .getResponse()
                .getCookie("refreshToken");

        assertThat(refreshCookie).isNotNull();
        String newRefreshToken = refreshCookie.getValue();
        assertThat(newRefreshToken).isNotEqualTo(oldRefreshToken);

        RefreshToken oldTokenDb = refreshTokenRepository.findByToken(oldRefreshToken).orElseThrow();
        assertThat(oldTokenDb.isRevoked()).isTrue();

        RefreshToken newTokenDb = refreshTokenRepository.findByToken(newRefreshToken).orElseThrow();
        assertThat(newTokenDb.isRevoked()).isFalse();

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", oldRefreshToken))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("refresh should revoke token family on reuse attempt")
    void refresh_should_detectTokenReuse_when_oldTokenUsedMultipleTimes() throws Exception {
        refreshTokenService.setGracePeriodSeconds(0);
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");
        Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getCookie("refreshToken");

        assertThat(loginCookie).isNotNull();
        String token1 = loginCookie.getValue();

        Cookie refreshCookie = mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", token1))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getCookie("refreshToken");

        assertThat(refreshCookie).isNotNull();
        String token2 = refreshCookie.getValue();

        RefreshToken token2DbBefore = refreshTokenRepository.findByToken(token2).orElseThrow();
        assertThat(token2DbBefore.isRevoked()).isFalse();

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", token1))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        RefreshToken token2DbAfter = refreshTokenRepository.findByToken(token2).orElseThrow();
        assertThat(token2DbAfter.isRevoked()).isTrue();

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", token2))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
        refreshTokenService.setGracePeriodSeconds(10);
    }

    @Test
    @DisplayName("session limiting should revoke oldest refresh token when max limit is exceeded")
    void sessionLimiting_should_revokeOldestToken_when_limitExceeded() throws Exception {
        refreshTokenService.setMaxPerUser(2);

        RefreshToken r1 = refreshTokenService.createRefreshToken(testUser);
        RefreshToken r2 = refreshTokenService.createRefreshToken(testUser);
        RefreshToken r3 = refreshTokenService.createRefreshToken(testUser);

        RefreshToken r1Db = refreshTokenRepository.findById(r1.getId()).orElseThrow();
        RefreshToken r2Db = refreshTokenRepository.findById(r2.getId()).orElseThrow();
        RefreshToken r3Db = refreshTokenRepository.findById(r3.getId()).orElseThrow();

        assertThat(r1Db.isRevoked()).isTrue();
        assertThat(r2Db.isRevoked()).isFalse();
        assertThat(r3Db.isRevoked()).isFalse();

        refreshTokenService.setMaxPerUser(5);
    }

    @Test
    @DisplayName("refresh should enforce rate limit of 5 requests per window")
    void refresh_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/auth/refresh")
                    .cookie(new Cookie("refreshToken", "dummy-token"))
                    .accept(MediaType.APPLICATION_JSON));
        }

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", "dummy-token"))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("login should enforce rate limit of 10 requests per window")
    void login_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest))
                    .accept(MediaType.APPLICATION_JSON));
        }

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("register should enforce rate limit of 5 requests per window")
    void register_should_blockWithTooManyRequests_when_rateLimitExceeded() throws Exception {
        for (int i = 0; i < 5; i++) {
            RegisterRequestDto registerRequest = new RegisterRequestDto("new-user-" + i,
                    "new-user-" + i + "@example.com", "securepassword");
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest))
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        RegisterRequestDto registerRequest = new RegisterRequestDto("new-user-5",
                "new-user-5@example.com", "securepassword");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("logout should clear cookie, revoke refresh token, and prevent subsequent token reuse")
    void logout_should_revokeTokenAndClearCookie_when_called() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");
        Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getCookie("refreshToken");

        assertThat(loginCookie).isNotNull();
        String refreshToken = loginCookie.getValue();

        mockMvc.perform(post("/api/auth/logout")
                .cookie(new Cookie("refreshToken", refreshToken))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("refreshToken", 0));

        RefreshToken tokenDb = refreshTokenRepository.findByToken(refreshToken).orElseThrow();
        assertThat(tokenDb.isRevoked()).isTrue();

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", refreshToken))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("refresh should reject expired tokens and clean them from repository")
    void refresh_should_rejectExpiredToken_when_tokenHasExpired() throws Exception {
        RefreshToken expiredToken = new RefreshToken();
        expiredToken.setUser(testUser);
        expiredToken.setToken("expired-dummy-token");
        expiredToken.setExpiryDate(
                java.time.Instant.now().minus(1, java.time.temporal.ChronoUnit.HOURS));
        expiredToken.setRevoked(false);
        refreshTokenRepository.save(expiredToken);

        mockMvc.perform(post("/api/auth/refresh")
                .cookie(new Cookie("refreshToken", "expired-dummy-token"))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        assertThat(refreshTokenRepository.findByToken("expired-dummy-token")).isEmpty();
    }
}
