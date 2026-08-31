package com.deck.lab.backend.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.deck.lab.backend.dto.request.RegisterRequestDto;
import com.deck.lab.backend.model.User;

@DisplayName("UserMapper Unit Tests")
class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
    }

    @Test
    @DisplayName("toEntity should map RegisterRequestDto and hashed password into User entity")
    void toEntity_should_mapFields_when_dtoIsValid() {
        RegisterRequestDto dto = new RegisterRequestDto("yugi", "yugi@example.com", "password");
        String encodedPassword = "encodedPassword123";

        User user = userMapper.toEntity(dto, encodedPassword);

        assertThat(user).isNotNull();
        assertThat(user.getUsername()).isEqualTo("yugi");
        assertThat(user.getEmail()).isEqualTo("yugi@example.com");
        assertThat(user.getPassword()).isEqualTo("encodedPassword123");
    }

    @Test
    @DisplayName("toEntity should return null when DTO is null")
    void toEntity_should_returnNull_when_dtoIsNull() {
        assertThat(userMapper.toEntity(null, "encodedPassword")).isNull();
    }
}
