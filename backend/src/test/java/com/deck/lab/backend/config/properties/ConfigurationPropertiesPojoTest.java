package com.deck.lab.backend.config.properties;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
            assertAll("Verify JwtProperties defaults",
                    () -> assertNotNull(properties.getSecret()),
                    () -> assertFalse(properties.getSecret().isEmpty()),
                    () -> assertEquals(900000L, properties.getExpiration())
            );
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
            assertAll("Verify mutated JwtProperties",
                    () -> assertEquals("custom-secret-key", properties.getSecret()),
                    () -> assertEquals(3600000L, properties.getExpiration())
            );
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
            assertAll("Verify RefreshTokenProperties defaults",
                    () -> assertEquals(7, properties.getDurationDays()),
                    () -> assertEquals(5, properties.getMaxPerUser()),
                    () -> assertEquals(10, properties.getGracePeriodSeconds()),
                    () -> assertEquals("0 0 3 * * *", properties.getCleanupSchedule())
            );
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
            assertAll("Verify mutated RefreshTokenProperties",
                    () -> assertEquals(14, properties.getDurationDays()),
                    () -> assertEquals(10, properties.getMaxPerUser()),
                    () -> assertEquals(30, properties.getGracePeriodSeconds()),
                    () -> assertEquals("0 0 4 * * *", properties.getCleanupSchedule())
            );
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
            assertAll("Verify CorsProperties defaults",
                    () -> assertNotNull(properties.getAllowedOrigins()),
                    () -> assertTrue(properties.getAllowedOrigins().contains("http://localhost:5173"))
            );
        }

        @Test
        @DisplayName("should correctly mutate and retrieve properties via getters and setters")
        void should_mutateAndRetrieveProperties() {
            // Arrange
            CorsProperties properties = new CorsProperties();

            // Act
            properties.setAllowedOrigins(List.of("https://example.com", "https://app.example.com"));

            // Assert
            assertAll("Verify mutated CorsProperties",
                    () -> assertEquals(2, properties.getAllowedOrigins().size()),
                    () -> assertTrue(properties.getAllowedOrigins().contains("https://example.com")),
                    () -> assertTrue(properties.getAllowedOrigins().contains("https://app.example.com"))
            );
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
            assertAll("Verify YgoProDeckProperties defaults",
                    () -> assertEquals("https://db.ygoprodeck.com/api/v7/cardinfo.php", properties.getApiUrl()),
                    () -> assertEquals(500, properties.getBatchSize()),
                    () -> assertEquals(5000, properties.getConnectTimeout()),
                    () -> assertEquals(5000, properties.getReadTimeout())
            );
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
            assertAll("Verify mutated YgoProDeckProperties",
                    () -> assertEquals("https://custom.api/cards", properties.getApiUrl()),
                    () -> assertEquals(100, properties.getBatchSize()),
                    () -> assertEquals(10000, properties.getConnectTimeout()),
                    () -> assertEquals(15000, properties.getReadTimeout())
            );
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
            assertAll("Verify SeederProperties defaults",
                    () -> assertFalse(properties.isCards()),
                    () -> assertFalse(properties.isUsers()),
                    () -> assertEquals("12345678", properties.getPassword())
            );
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
            assertAll("Verify mutated SeederProperties",
                    () -> assertTrue(properties.isCards()),
                    () -> assertTrue(properties.isUsers()),
                    () -> assertEquals("customPassword!9", properties.getPassword())
            );
        }
    }
}
