package com.deck.lab.backend.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Central configuration class setting up Spring Security guidelines for the
 * application.
 *
 * <p>
 * <strong>Spring Security Configuration:</strong>
 * </p>
 * <ul>
 * <li>{@code @Configuration}: Tells Spring that this class contains
 * {@code @Bean} definition methods that the IoC container will process to
 * generate singleton beans available across the application.</li>
 * <li>{@code @EnableWebSecurity}: Enables Spring Security's web security
 * support and integrates it with Spring MVC.</li>
 * <li>{@code @EnableScheduling}: Enables Spring's task scheduling capabilities,
 * used elsewhere to trigger background cleanups (e.g. for expired tokens).</li>
 * </ul>
 *
 * <p>
 * <strong>Security Model Constraints:</strong>
 * </p>
 * <ul>
 * <li><strong>Stateless Session Management:</strong>
 * Since we use JWTs for authentication, we configure the session policy to
 * {@link SessionCreationPolicy#STATELESS}. The server does not store user
 * session states in memory; every request must carry its own authentication
 * token.</li>
 * <li><strong>CSRF (Cross-Site Request Forgery) Disabled:</strong>
 * CSRF protection is generally disabled for stateless APIs that do not store
 * session cookies (or leverage custom header authorization fields), as they are
 * inherently immune to CSRF exploits.</li>
 * <li><strong>Security Filter Chain:</strong>
 * Defines the HTTP request pipeline. It configures public routes (like login,
 * registration, and card catalog lists) and inserts the custom
 * {@link JwtAuthenticationFilter} <i>before</i> Spring's standard
 * {@link UsernamePasswordAuthenticationFilter} to intercept and validate JWT
 * credentials.</li>
 * <li><strong>CORS (Cross-Origin Resource Sharing):</strong>
 * Restricts API access to authorized domain origins (configured via
 * {@code allowedOrigins}), specifying allowed HTTP methods and headers to
 * prevent unauthorized cross-origin browser requests.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableScheduling
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Defines the SecurityFilterChain mapping endpoint authorizations, stateless
     * session state, custom auth providers, and hooks the JWT authentication
     * filter.
     *
     * @param http the HttpSecurity builder context
     * @return the fully configured SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrfConfigurer -> csrfConfigurer.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/cards/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cards/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/decks/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/decks/validate").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures the default Spring DaoAuthenticationProvider, loading credentials
     * from UserDetailsService and hashing passwords using BCrypt.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Exposes the AuthenticationManager from configuration to authenticate
     * username/password requests.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configures CORS authorization rules mapping allowed origins, methods, and
     * credential access.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        String[] originsArray = allowedOrigins.split(",");
        for (int i = 0; i < originsArray.length; i++) {
            originsArray[i] = originsArray[i].trim();
        }
        configuration.setAllowedOrigins(Arrays.asList(originsArray));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Sets BCryptPasswordEncoder as the standard password hashing algorithm.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
