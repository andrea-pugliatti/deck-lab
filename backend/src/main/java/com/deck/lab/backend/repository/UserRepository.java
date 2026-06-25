package com.deck.lab.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);
}
