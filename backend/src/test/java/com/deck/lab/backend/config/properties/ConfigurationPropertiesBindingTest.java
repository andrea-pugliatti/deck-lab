package com.deck.lab.backend.config.properties;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

@DisplayName("Configuration Properties Binding Integration Tests")
class ConfigurationPropertiesBindingTest {

    @Configuration
    @EnableConfigurationProperties({
            JwtProperties.class,
            RefreshTokenProperties.class,
            CorsProperties.class,
            YgoProDeckProperties.class,
            SeederProperties.class
    })
    static class TestConfig {
    }

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TestConfig.class);

    @Nested
    @DisplayName("JwtProperties Binding")
    class JwtPropertiesBinding {

        @Test
        @DisplayName("should bind custom properties from property source")
        void should_bindCustomJwtProperties() {
            contextRunner
                    .withPropertyValues(
                            "jwt.secret=custom-injected-secret-key-12345",
                            "jwt.expiration=1800000"
                    )
                    .run(context -> {
                        assertThat(context).hasNotFailed();
                        JwtProperties properties = context.getBean(JwtProperties.class);
                        assertThat(properties.getSecret()).isEqualTo("custom-injected-secret-key-12345");
                        assertThat(properties.getExpiration()).isEqualTo(1800000L);
                    });
        }
    }

    @Nested
    @DisplayName("RefreshTokenProperties Binding")
    class RefreshTokenPropertiesBinding {

        @Test
        @DisplayName("should bind custom properties from property source")
        void should_bindCustomRefreshTokenProperties() {
            contextRunner
                    .withPropertyValues(
                            "refresh-token.duration-days=14",
                            "refresh-token.max-per-user=10",
                            "refresh-token.grace-period-seconds=25",
                            "refresh-token.cleanup-schedule=0 0 12 * * *"
                    )
                    .run(context -> {
                        assertThat(context).hasNotFailed();
                        RefreshTokenProperties properties = context.getBean(RefreshTokenProperties.class);
                        assertThat(properties.getDurationDays()).isEqualTo(14);
                        assertThat(properties.getMaxPerUser()).isEqualTo(10);
                        assertThat(properties.getGracePeriodSeconds()).isEqualTo(25);
                        assertThat(properties.getCleanupSchedule()).isEqualTo("0 0 12 * * *");
                    });
        }
    }

    @Nested
    @DisplayName("CorsProperties Binding")
    class CorsPropertiesBinding {

        @Test
        @DisplayName("should bind comma-separated allowed origins to List<String>")
        void should_bindCommaSeparatedCorsOrigins() {
            contextRunner
                    .withPropertyValues(
                            "app.cors.allowed-origins=http://staging.domain.com,https://prod.domain.com"
                    )
                    .run(context -> {
                        assertThat(context).hasNotFailed();
                        CorsProperties properties = context.getBean(CorsProperties.class);
                        assertThat(properties.getAllowedOrigins()).containsExactly(
                                "http://staging.domain.com",
                                "https://prod.domain.com"
                        );
                    });
        }
    }

    @Nested
    @DisplayName("YgoProDeckProperties Binding")
    class YgoProDeckPropertiesBinding {

        @Test
        @DisplayName("should bind custom properties from property source")
        void should_bindCustomYgoProDeckProperties() {
            contextRunner
                    .withPropertyValues(
                            "app.ygoprodeck.api-url=https://custom-mock-server/cards",
                            "app.ygoprodeck.batch-size=250",
                            "app.ygoprodeck.connect-timeout=8000",
                            "app.ygoprodeck.read-timeout=9000"
                    )
                    .run(context -> {
                        assertThat(context).hasNotFailed();
                        YgoProDeckProperties properties = context.getBean(YgoProDeckProperties.class);
                        assertThat(properties.getApiUrl()).isEqualTo("https://custom-mock-server/cards");
                        assertThat(properties.getBatchSize()).isEqualTo(250);
                        assertThat(properties.getConnectTimeout()).isEqualTo(8000);
                        assertThat(properties.getReadTimeout()).isEqualTo(9000);
                    });
        }
    }

    @Nested
    @DisplayName("SeederProperties Binding")
    class SeederPropertiesBinding {

        @Test
        @DisplayName("should bind custom properties from property source")
        void should_bindCustomSeederProperties() {
            contextRunner
                    .withPropertyValues(
                            "app.seed.cards=true",
                            "app.seed.users=true",
                            "app.seed.password=SuperSecretSeed123!"
                    )
                    .run(context -> {
                        assertThat(context).hasNotFailed();
                        SeederProperties properties = context.getBean(SeederProperties.class);
                        assertThat(properties.isCards()).isTrue();
                        assertThat(properties.isUsers()).isTrue();
                        assertThat(properties.getPassword()).isEqualTo("SuperSecretSeed123!");
                    });
        }
    }
}
