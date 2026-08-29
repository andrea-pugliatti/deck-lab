package com.deck.lab.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for integrating with the external YGOPRODeck card database API.
 *
 * <p>
 * Binds properties prefixed with {@code app.ygoprodeck} from application configuration sources.
 * </p>
 */
@ConfigurationProperties(prefix = "app.ygoprodeck")
public class YgoProDeckProperties {

    /**
     * Endpoint URL for retrieving Yu-Gi-Oh card catalog information.
     */
    private String apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

    /**
     * Batch size for chunked database persistence operations during card seeding.
     */
    private int batchSize = 500;

    /**
     * Connection timeout in milliseconds for HTTP requests to YGOPRODeck.
     */
    private int connectTimeout = 5000;

    /**
     * Read timeout in milliseconds for HTTP requests to YGOPRODeck.
     */
    private int readTimeout = 5000;

    /**
     * Returns the YGOPRODeck API endpoint URL.
     *
     * @return the API endpoint URL
     */
    public String getApiUrl() {
        return apiUrl;
    }

    /**
     * Sets the YGOPRODeck API endpoint URL.
     *
     * @param apiUrl the API endpoint URL
     */
    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * Returns the database batch size for card import operations.
     *
     * @return the batch size
     */
    public int getBatchSize() {
        return batchSize;
    }

    /**
     * Sets the database batch size for card import operations.
     *
     * @param batchSize the batch size
     */
    public void setBatchSize(int batchSize) {
        this.batchSize = batchSize;
    }

    /**
     * Returns the HTTP connection timeout in milliseconds.
     *
     * @return the connection timeout in milliseconds
     */
    public int getConnectTimeout() {
        return connectTimeout;
    }

    /**
     * Sets the HTTP connection timeout in milliseconds.
     *
     * @param connectTimeout the connection timeout in milliseconds
     */
    public void setConnectTimeout(int connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    /**
     * Returns the HTTP read timeout in milliseconds.
     *
     * @return the read timeout in milliseconds
     */
    public int getReadTimeout() {
        return readTimeout;
    }

    /**
     * Sets the HTTP read timeout in milliseconds.
     *
     * @param readTimeout the read timeout in milliseconds
     */
    public void setReadTimeout(int readTimeout) {
        this.readTimeout = readTimeout;
    }
}
