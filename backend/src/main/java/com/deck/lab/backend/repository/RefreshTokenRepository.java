package com.deck.lab.backend.repository;

import com.deck.lab.backend.model.RefreshToken;
import com.deck.lab.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserAndRevokedFalseOrderByCreatedAtAsc(User user);

    List<RefreshToken> findByUser(User user);

    @Modifying
    @Transactional
    void deleteByExpiryDateBeforeOrRevokedTrue(Instant now);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
