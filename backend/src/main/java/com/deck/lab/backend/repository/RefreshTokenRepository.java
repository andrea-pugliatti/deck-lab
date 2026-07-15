package com.deck.lab.backend.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;

/**
 * JPA Repository interface for {@link RefreshToken} database entities.
 * 
 * <p>
 * <b>Modifying Queries & Transactions:</b> Database write operations (like {@code #delete} or
 * {@code update}) that are custom-declared require <i>@Modifying</i> and <i>@Transactional</i>
 * annotations. <i>@Modifying</i> instructs Spring to execute the query as a state-changing DML
 * operation instead of a standard SELECT query, and <i>@Transactional</i> binds the execution to a
 * database transaction, guaranteeing ACID safety.
 * </p>
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Finds a RefreshToken entity by its unique token value string.
     *
     * @param token token string to search
     * @return Optional containing token details if found
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Resolves all active (non-revoked) tokens associated with a user, sorted by creation date.
     * Used to implement session capping rules.
     *
     * @param user owner user account
     * @return list of active RefreshTokens
     */
    List<RefreshToken> findByUserAndRevokedFalseOrderByCreatedAtAsc(User user);

    /**
     * Retrieves all tokens (active, expired, or revoked) associated with a user.
     *
     * @param user owner user account
     * @return list of historical and active RefreshTokens
     */
    List<RefreshToken> findByUser(User user);

    /**
     * Custom delete query removing expired or manually revoked tokens from the database. Annotated
     * with {@link org.springframework.data.jpa.repository.Modifying} to indicate write operation.
     *
     * @param now time threshold representing current Instant
     */
    @Modifying
    @Transactional
    void deleteByExpiryDateBeforeOrRevokedTrue(Instant now);

    /**
     * Deletes all tokens associated with a user. Used to completely clear sessions.
     *
     * @param user owner user account context
     */
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
