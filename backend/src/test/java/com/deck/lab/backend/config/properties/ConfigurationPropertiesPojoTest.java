package com.deck.lab.backend.config.properties;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Configuration Properties POJO Unit Tests")
class ConfigurationPropertiesPojoTest {

    @Nested
    @DisplayName("JwtProperties Tests")
    class JwtPropertiesTests {

        @Test
        @DisplayName("should initialize with sensible default values")
        void should_initializeWithDefaults() {
            // Act
            JwtProperties properties = new JwtProperties();

            // Assert
            assertThat(properties.getSecret()).isNotNull().isNotEmpty();
            assertThat(properties.getExpiration()).isEqualTo(900000L);
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            JwtProperties properties = new JwtProperties();

            // Act
            properties.setSecret("custom-secret-key");
            properties.setExpiration(3600000L);

            // Assert
            assertThat(properties.getSecret()).isEqualTo("custom-secret-key");
            assertThat(properties.getExpiration()).isEqualTo(3600000L);
        }
    }

    @Nested
    @DisplayName("RefreshTokenProperties Tests")
    class RefreshTokenPropertiesTests {

        @Test
        @DisplayName("should initialize with sensible default values")
        void should_initializeWithDefaults() {
            // Act
            RefreshTokenProperties properties = new RefreshTokenProperties();

            // Assert
            assertThat(properties.getDurationDays()).isEqualTo(7);
            assertThat(properties.getMaxPerUser()).isEqualTo(5);
            assertThat(properties.getGracePeriodSeconds()).isEqualTo(10);
            assertThat(properties.getCleanupSchedule()).isEqualTo("0 0 3 * * *");
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            RefreshTokenProperties properties = new RefreshTokenProperties();

            // Act
            properties.setDurationDays(14);
            properties.setMaxPerUser(10);
            properties.setGracePeriodSeconds(30);
            properties.setCleanupSchedule("0 0 4 * * *");

            // Assert
            assertThat(properties.getDurationDays()).isEqualTo(14);
            assertThat(properties.getMaxPerUser()).isEqualTo(10);
            assertThat(properties.getGracePeriodSeconds()).isEqualTo(30);
            assertThat(properties.getCleanupSchedule()).isEqualTo("0 0 4 * * *");
        }
    }

    @Nested
    @DisplayName("CorsProperties Tests")
    class CorsPropertiesTests {

        @Test
        @DisplayName("should initialize with sensible default values")
        void should_initializeWithDefaults() {
            // Act
            CorsProperties properties = new CorsProperties();

            // Assert
            assertThat(properties.getAllowedOrigins())
                    .isNotNull()
                    .contains("http://localhost:5173");
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            CorsProperties properties = new CorsProperties();

            // Act
            properties.setAllowedOrigins(List.of("https://example.com", "https://app.example.com"));

            // Assert
            assertThat(properties.getAllowedOrigins())
                    .hasSize(2)
                    .containsExactly("https://example.com", "https://app.example.com");
        }
    }

    @Nested
    @DisplayName("YgoProDeckProperties Tests")
    class YgoProDeckPropertiesTests {

        @Test
        @DisplayName("should initialize with sensible default values")
        void should_initializeWithDefaults() {
            // Act
            YgoProDeckProperties properties = new YgoProDeckProperties();

            // Assert
            assertThat(properties.getApiUrl()).isEqualTo("https://db.ygoprodeck.com/api/v7/cardinfo.php");
            assertThat(properties.getBatchSize()).isEqualTo(500);
            assertThat(properties.getConnectTimeout()).isEqualTo(5000);
            assertThat(properties.getReadTimeout()).isEqualTo(5000);
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            YgoProDeckProperties properties = new YgoProDeckProperties();

            // Act
            properties.setApiUrl("https://custom.api/cards");
            properties.setBatchSize(100);
            properties.setConnectTimeout(10000);
            properties.setReadTimeout(15000);

            // Assert
            assertThat(properties.getApiUrl()).isEqualTo("https://custom.api/cards");
            assertThat(properties.getBatchSize()).isEqualTo(100);
            assertThat(properties.getConnectTimeout()).isEqualTo(10000);
            assertThat(properties.getReadTimeout()).isEqualTo(15000);
        }
    }

    @Nested
    @DisplayName("SeederProperties Tests")
    class SeederPropertiesTests {

        @Test
        @DisplayName("should initialize with sensible default values")
        void should_initializeWithDefaults() {
            // Act
            SeederProperties properties = new SeederProperties();

            // Assert
            assertThat(properties.isCards()).isFalse();
            assertThat(properties.isUsers()).isFalse();
            assertThat(properties.getPassword()).isEqualTo("12345678");
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            SeederProperties properties = new SeederProperties();

            // Act
            properties.setCards(true);
            properties.setUsers(true);
            properties.setPassword("customPassword!9");

            // Assert
            assertThat(properties.isCards()).isTrue();
            assertThat(properties.isUsers()).isTrue();
            assertThat(properties.getPassword()).isEqualTo("customPassword!9");
        }
    }
}
