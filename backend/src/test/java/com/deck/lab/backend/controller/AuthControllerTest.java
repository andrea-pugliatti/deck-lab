package com.deck.lab.backend.controller;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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
import com.deck.lab.backend.security.JwtService;
import com.deck.lab.backend.security.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

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
        private ObjectMapper objectMapper;

        private User testUser;

        @BeforeEach
        void setUp() {
                refreshTokenService.resetRateLimits();
                testUser = new User("auth-test-user", passwordEncoder.encode("securepassword"),
                                "auth-test-email@example.com");
                testUser = userRepository.save(testUser);
        }

        @Test
        void testSuccessfulLoginAndTokenExtraction() throws Exception {
                LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");

                String responseBody = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token", notNullValue()))
                                .andExpect(jsonPath("$.accessToken", notNullValue()))
                                .andExpect(cookie().exists("refreshToken"))
                                .andReturn().getResponse().getContentAsString();

                String token = objectMapper.readTree(responseBody).get("accessToken").asString();
                String extractedSubject = jwtService.extractUsername(token);
                assertEquals("auth-test-email@example.com", extractedSubject);
        }

        @Test
        void testLoginWithInvalidCredentials() throws Exception {
                LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "wrongpassword");

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        void testAccessProtectedResourceWithAndWithoutToken() throws Exception {
                mockMvc.perform(post("/api/decks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}")
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isForbidden());

                String token = jwtService.generateToken(testUser.getEmail());

                mockMvc.perform(post("/api/decks")
                                .header("Authorization", "Bearer " + token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}")
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testRegisterSuccess() throws Exception {
                RegisterRequestDto registerRequest = new RegisterRequestDto("new-user", "new-email@example.com",
                                "newsecurepassword");

                String responseBody = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token", notNullValue()))
                                .andExpect(jsonPath("$.accessToken", notNullValue()))
                                .andExpect(cookie().exists("refreshToken"))
                                .andReturn().getResponse().getContentAsString();

                String token = objectMapper.readTree(responseBody).get("accessToken").asString();
                String extractedSubject = jwtService.extractUsername(token);
                assertEquals("new-email@example.com", extractedSubject);
        }

        @Test
        void testRegisterDuplicateUsername() throws Exception {
                RegisterRequestDto registerRequest = new RegisterRequestDto("auth-test-user", "new-email-2@example.com",
                                "newsecurepassword");

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testRegisterDuplicateEmail() throws Exception {
                RegisterRequestDto registerRequest = new RegisterRequestDto("new-user-2", "auth-test-email@example.com",
                                "newsecurepassword");

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testTokenRotationFlow() throws Exception {
                LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");

                Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(cookie().exists("refreshToken"))
                                .andReturn().getResponse().getCookie("refreshToken");

                assertNotNull(loginCookie);
                String oldRefreshToken = loginCookie.getValue();

                Cookie refreshCookie = mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", oldRefreshToken))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken", notNullValue()))
                                .andExpect(cookie().exists("refreshToken"))
                                .andReturn().getResponse().getCookie("refreshToken");

                assertNotNull(refreshCookie);
                String newRefreshToken = refreshCookie.getValue();
                assertNotEquals(oldRefreshToken, newRefreshToken);

                RefreshToken oldTokenDb = refreshTokenRepository.findByToken(oldRefreshToken).orElseThrow();
                assertTrue(oldTokenDb.isRevoked());

                RefreshToken newTokenDb = refreshTokenRepository.findByToken(newRefreshToken).orElseThrow();
                assertFalse(newTokenDb.isRevoked());

                mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", oldRefreshToken))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isForbidden());
        }

        @Test
        void testTokenReuseDetection() throws Exception {
                refreshTokenService.setGracePeriodSeconds(0);
                LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");
                Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getCookie("refreshToken");

                assertNotNull(loginCookie);
                String token1 = loginCookie.getValue();

                Cookie refreshCookie = mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", token1))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getCookie("refreshToken");

                assertNotNull(refreshCookie);
                String token2 = refreshCookie.getValue();

                RefreshToken token2DbBefore = refreshTokenRepository.findByToken(token2).orElseThrow();
                assertFalse(token2DbBefore.isRevoked());

                mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", token1))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isForbidden());

                RefreshToken token2DbAfter = refreshTokenRepository.findByToken(token2).orElseThrow();
                assertTrue(token2DbAfter.isRevoked());

                mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", token2))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isForbidden());
                refreshTokenService.setGracePeriodSeconds(10);
        }

        @Test
        void testSessionLimiting() throws Exception {
                refreshTokenService.setMaxPerUser(2);

                RefreshToken r1 = refreshTokenService.createRefreshToken(testUser);
                RefreshToken r2 = refreshTokenService.createRefreshToken(testUser);
                RefreshToken r3 = refreshTokenService.createRefreshToken(testUser);

                RefreshToken r1Db = refreshTokenRepository.findById(r1.getId()).orElseThrow();
                RefreshToken r2Db = refreshTokenRepository.findById(r2.getId()).orElseThrow();
                RefreshToken r3Db = refreshTokenRepository.findById(r3.getId()).orElseThrow();

                assertTrue(r1Db.isRevoked());
                assertFalse(r2Db.isRevoked());
                assertFalse(r3Db.isRevoked());

                refreshTokenService.setMaxPerUser(5);
        }

        @Test
        void testRateLimiting() throws Exception {
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
        void testLogout() throws Exception {
                LoginRequestDto loginRequest = new LoginRequestDto("auth-test-user", "securepassword");
                Cookie loginCookie = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andReturn().getResponse().getCookie("refreshToken");

                assertNotNull(loginCookie);
                String refreshToken = loginCookie.getValue();

                mockMvc.perform(post("/api/auth/logout")
                                .cookie(new Cookie("refreshToken", refreshToken))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(cookie().maxAge("refreshToken", 0));

                RefreshToken tokenDb = refreshTokenRepository.findByToken(refreshToken).orElseThrow();
                assertTrue(tokenDb.isRevoked());

                mockMvc.perform(post("/api/auth/refresh")
                                .cookie(new Cookie("refreshToken", refreshToken))
                                .accept(MediaType.APPLICATION_JSON))
                                .andExpect(status().isForbidden());
        }
}
