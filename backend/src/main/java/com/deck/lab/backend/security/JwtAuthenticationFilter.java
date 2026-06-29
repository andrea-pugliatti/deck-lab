package com.deck.lab.backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * HTTP Security Filter that intercepts incoming REST API requests to inspect
 * and authorize requests containing JWT tokens.
 *
 * <p>
 * <strong>Filter (Chain of Responsibility / Intercepting Filter
 * Pattern)</strong>
 * </p>
 * <p>
 * This filter sits in front of the application controllers. It intercepts HTTP
 * requests, extracts the token, validates it, and updates Spring Security's
 * internal session context. It implements the Chain of Responsibility pattern:
 * once it finishes inspection, it delegates down the pipeline by calling
 * {@code filterChain.doFilter(request, response)}.
 * </p>
 *
 * <p>
 * <strong>Spring Security Components:</strong>
 * </p>
 * <ul>
 * <li>{@code OncePerRequestFilter}: A base class provided by Spring Security.
 * Unlike standard servlet filters, which can trigger multiple times during a
 * single request (due to internal forwards or redirects),
 * {@code OncePerRequestFilter} guarantees a single execution block per request
 * dispatch, ensuring consistency and saving processing cycles.</li>
 * <li>Authorization Header Parsing: It searches for the HTTP request header
 * {@code Authorization} matching the {@code Bearer <token>} format.</li>
 * <li>{@code SecurityContextHolder}: Spring Security's core context store. If
 * the token is valid, this class builds an
 * {@link UsernamePasswordAuthenticationToken} principal and stores it inside
 * {@link SecurityContextHolder#getContext()}. This is backed by a
 * {@code ThreadLocal} store, meaning the authenticated state is automatically
 * made available to all downstream services executing on the current request
 * processing thread.</li>
 * </ul>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Constructs a new JwtAuthenticationFilter.
     */
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Inspects the Authorization header, verifies JWT validity, and maps user auth
     * to the SecurityContext.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String email;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        String extractedEmail = null;
        try {
            extractedEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // Bad or expired token, proceed without setting authentication
        }
        email = extractedEmail;

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

                if (jwtService.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // If user loading fails, proceed without setting authentication
            }
        }
        filterChain.doFilter(request, response);
    }
}
