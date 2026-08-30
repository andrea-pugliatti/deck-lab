package com.deck.lab.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Spring configuration class registering framework beans for JSON serialization and HTTP REST
 * client building.
 *
 * <p>
 * Exposes Spring-managed {@link ObjectMapper} and {@link RestClient.Builder} beans to facilitate
 * constructor-based dependency injection throughout the application components.
 * </p>
 */
@Configuration
public class WebClientConfig {

    /**
     * Configures the primary {@link ObjectMapper} bean for JSON parsing and mapping.
     *
     * @return the configured {@link ObjectMapper} instance
     */
    @Bean
    @ConditionalOnMissingBean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    /**
     * Configures the default {@link RestClient.Builder} bean for creating synchronous REST clients.
     *
     * @return the {@link RestClient.Builder} instance
     */
    @Bean
    @ConditionalOnMissingBean
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }
}
