package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.model.User;

/**
 * Mapper component that translates user registration payloads into {@link User}
 * database entities.
 *
 * <p>
 * <b>Encrypted Fields:</b>
 * User passwords must never be stored in plain text or mapped directly from
 * user input. This mapper maps
 * credentials from a {@link RegisterRequestDto} but accepts a pre-hashed
 * password parameter to enforce
 * encryption boundaries before saving user state in database tables.
 */
@Component
public class UserMapper {

    /**
     * Converts a {@link RegisterRequestDto} to a transient {@link User} entity.
     * Maps user details and applies the pre-encoded password value.
     *
     * @param dto             registration payload received from client API
     * @param encodedPassword pre-hashed password string
     * @return unsaved User entity populated with details
     */
    public User toEntity(RegisterRequestDto dto, String encodedPassword) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(encodedPassword);
        return user;
    }
}
