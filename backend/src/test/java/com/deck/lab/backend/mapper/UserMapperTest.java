package com.deck.lab.backend.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.model.User;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
    }

    @Test
    void toEntity_withValidDto_mapsFieldsCorrectly() {
        RegisterRequestDto dto = new RegisterRequestDto("yugi", "yugi@example.com", "password");
        String encodedPassword = "encodedPassword123";

        User user = userMapper.toEntity(dto, encodedPassword);

        assertNotNull(user);
        assertEquals("yugi", user.getUsername());
        assertEquals("yugi@example.com", user.getEmail());
        assertEquals("encodedPassword123", user.getPassword());
    }

    @Test
    void toEntity_withNullDto_returnsNull() {
        assertNull(userMapper.toEntity(null, "encodedPassword"));
    }
}
