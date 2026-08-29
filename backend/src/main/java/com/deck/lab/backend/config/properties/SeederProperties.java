package com.deck.lab.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties controlling startup database initialization and seed data loading.
 *
 * <p>
 * Binds properties prefixed with {@code app.seed} from application configuration sources.
 * </p>
 */
@ConfigurationProperties(prefix = "app.seed")
public class SeederProperties {

    /**
     * Whether card catalogue and banlist seeding from YGOPRODeck is enabled on startup.
     */
    private boolean cards = false;

    /**
     * Whether default demo/admin user seeding is enabled on startup.
     */
    private boolean users = false;

    /**
     * Default raw password assigned to seeded users.
     */
    private String password = "12345678";

    /**
     * Returns whether card seeding is enabled.
     *
     * @return true if card seeding is enabled, false otherwise
     */
    public boolean isCards() {
        return cards;
    }

    /**
     * Sets whether card seeding is enabled.
     *
     * @param cards true to enable card seeding, false to disable
     */
    public void setCards(boolean cards) {
        this.cards = cards;
    }

    /**
     * Returns whether user seeding is enabled.
     *
     * @return true if user seeding is enabled, false otherwise
     */
    public boolean isUsers() {
        return users;
    }

    /**
     * Sets whether user seeding is enabled.
     *
     * @param users true to enable user seeding, false to disable
     */
    public void setUsers(boolean users) {
        this.users = users;
    }

    /**
     * Returns the default password for seeded accounts.
     *
     * @return the default password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the default password for seeded accounts.
     *
     * @param password the default password
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
