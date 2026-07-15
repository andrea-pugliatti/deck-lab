package com.deck.lab.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.User;

/**
 * JPA Repository interface for {@link User} database entities.
 * 
 * <p>
 * <b>Spring Data JPA Abstraction:</b> In traditional Java, database query logic requires writing
 * tedious JDBC boilerplate code and SQL statements. Spring Data JPA eliminates this. By extending
 * {@link JpaRepository}, Spring automatically generates SQL statements at runtime based on the
 * method names (e.g. {@code findByUsername} automatically generates
 * {@code SELECT * FROM users WHERE username = ?}).
 * </p>
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Resolves a user profile by their unique username.
     *
     * @param username user account handle string
     * @return Optional containing user entity if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Resolves a user profile by their unique email.
     *
     * @param email user email string
     * @return Optional containing user entity if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Resolves a user profile matching either username or email constraints. Used to prevent
     * duplication during user registration.
     *
     * @param username user handle string
     * @param email    user email string
     * @return Optional containing user entity if database record exists matching either query
     *             parameters
     */
    Optional<User> findByUsernameOrEmail(String username, String email);
}
