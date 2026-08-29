package com.deck.lab.backend.config.properties;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for Cross-Origin Resource Sharing (CORS) policies.
 *
 * <p>
 * Binds properties prefixed with {@code app.cors} from application configuration sources.
 * </p>
 */
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    /**
     * List of origins permitted to make cross-origin requests.
     */
    private List<String> allowedOrigins = new ArrayList<>(List.of(
            "http://localhost:5173",
            "http://localhost",
            "http://127.0.0.1:5173"
    ));

    /**
     * Returns the list of permitted CORS origins.
     *
     * @return the list of allowed origin URLs
     */
    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    /**
     * Sets the list of permitted CORS origins.
     *
     * @param allowedOrigins the list of allowed origin URLs
     */
    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}
