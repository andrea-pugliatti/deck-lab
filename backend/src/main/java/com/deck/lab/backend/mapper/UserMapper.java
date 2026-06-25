package com.deck.lab.backend.mapper;

import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.model.User;

@Component
public class UserMapper {

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
