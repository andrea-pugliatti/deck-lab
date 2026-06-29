package com.deck.lab.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.deck.lab.backend.repository.UserRepository;

/**
 * Custom implementation of Spring Security's UserDetailsService interface.
 *
 * <p>
 * <strong>Security Service (Authentication Provider)</strong>
 * </p>
 * <p>
 * Spring Security manages authentication using filters and managers. To verify
 * credentials, Spring Security delegates identity lookups to a
 * {@link UserDetailsService} bean. This class implements that contract,
 * retrieving user profiles from the database and mapping them to Spring's
 * security lifecycle context.
 * </p>
 *
 * <p>
 * <strong>Flexible Lookup (Username or Email):</strong>
 * </p>
 * <p>
 * Standard implementations only search by username. In this application, the
 * {@link #loadUserByUsername(String)} method is customized to query the
 * {@link UserRepository} by either username OR email. This allows clients to
 * authenticate using either identifier, resolving to a fully populated
 * {@link UserDetails} (our custom {@link User}) principal.
 * </p>
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Resolves a user principal by their username or email handle.
     * Evaluates username matches first, falling back to email searches.
     *
     * @param usernameOrEmail user handle (username or email address)
     * @return UserDetails populated matching principal
     * @throws UsernameNotFoundException if no user record matches the query
     *                                   parameter
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username or email: " + usernameOrEmail));
    }
}
