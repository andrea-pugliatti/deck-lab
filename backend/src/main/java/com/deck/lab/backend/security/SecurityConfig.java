package com.deck.lab.backend.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.deck.lab.backend.config.properties.CorsProperties;

/**
 * Main Spring Security configuration class defining authentication, authorization, and CORS rules.
 *
 * <p>
 * <strong>Application Security Architecture:</strong>
 * </p>
 * <ul>
 * <li><strong>Stateless Session Management:</strong> Configured with
 * {@link SessionCreationPolicy#STATELESS}. The server holds no in-memory HTTP session state; every
 * request must supply a valid JWT in its {@code Authorization: Bearer <token>} header.</li>
 * <li><strong>CSRF Disabled:</strong> Cross-Site Request Forgery protections are disabled because
 * the API relies on bearer tokens in HTTP headers (rather than cookies for critical
 * authorization fields), as they are inherently immune to CSRF exploits.</li>
 * <li><strong>Security Filter Chain:</strong> Defines the HTTP request pipeline. It configures
 * public routes (like login, registration, and card catalog lists) and inserts the custom
 * {@link JwtAuthenticationFilter} <i>before</i> Spring's standard
 * {@link UsernamePasswordAuthenticationFilter} to intercept and validate JWT credentials.</li>
 * <li><strong>CORS (Cross-Origin Resource Sharing):</strong> Restricts API access to authorized
 * domain origins (configured via {@link CorsProperties}), specifying allowed HTTP methods and
 * headers to prevent unauthorized cross-origin browser requests.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableScheduling
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CorsProperties corsProperties;

    /**
     * Constructs SecurityConfig with required authentication filters and CORS properties.
     *
     * @param jwtAuthFilter   the JWT authentication filter to intercept requests
     * @param corsProperties  configuration properties containing allowed CORS origins
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CorsProperties corsProperties) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsProperties = corsProperties;
    }

    /**
     * Defines the SecurityFilterChain mapping endpoint authorizations, stateless session state,
     * custom auth providers, and hooks the JWT authentication filter.
     *
     * @param http the HttpSecurity builder context
     * @return the fully configured SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrfConfigurer -> csrfConfigurer.disable())
                .authorizeHttpRequests(
                        auth -> auth.requestMatchers("/api/auth/**")
                                .permitAll()
                                .requestMatchers("/actuator/**")
                                .permitAll()
                                .requestMatchers("/api/cards/images/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/cards/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/decks/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/decks/validate")
                                .permitAll()
                                .requestMatchers("/error")
                                .permitAll()
                                .anyRequest()
                                .authenticated())
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(
                        new HttpStatusEntryPoint(
                                HttpStatus.UNAUTHORIZED)))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Exposes the AuthenticationManager from configuration to authenticate username/password
     * requests.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configures CORS authorization rules mapping allowed origins, methods, and credential access.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
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
