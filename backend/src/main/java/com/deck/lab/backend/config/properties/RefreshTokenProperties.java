package com.deck.lab.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for refresh token lifecycle, retention, and rotation security.
 *
 * <p>
 * Binds properties prefixed with {@code refresh-token} from application configuration sources.
 * </p>
 */
@ConfigurationProperties(prefix = "refresh-token")
public class RefreshTokenProperties {

    /**
     * Duration in days before a refresh token expires. Default is 7 days.
     */
    private int durationDays = 7;

    /**
     * Maximum number of active refresh token sessions allowed per user. Default is 5.
     */
    private int maxPerUser = 5;

    /**
     * Grace period in seconds for concurrent token rotation race conditions. Default is 10 seconds.
     */
    private int gracePeriodSeconds = 10;

    /**
     * Cron expression schedule for purging expired and revoked tokens from the database. Default is daily at 3 AM.
     */
    private String cleanupSchedule = "0 0 3 * * *";

    /**
     * Returns the refresh token validity duration in days.
     *
     * @return the validity duration in days
     */
    public int getDurationDays() {
        return durationDays;
    }

    /**
     * Sets the refresh token validity duration in days.
     *
     * @param durationDays the validity duration in days
     */
    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    /**
     * Returns the maximum number of active sessions allowed per user.
     *
     * @return the maximum active sessions per user
     */
    public int getMaxPerUser() {
        return maxPerUser;
    }

    /**
     * Sets the maximum number of active sessions allowed per user.
     *
     * @param maxPerUser the maximum active sessions per user
     */
    public void setMaxPerUser(int maxPerUser) {
        this.maxPerUser = maxPerUser;
    }

    /**
     * Returns the rotation grace period in seconds.
     *
     * @return the grace period in seconds
     */
    public int getGracePeriodSeconds() {
        return gracePeriodSeconds;
    }

    /**
     * Sets the rotation grace period in seconds.
     *
     * @param gracePeriodSeconds the grace period in seconds
     */
    public void setGracePeriodSeconds(int gracePeriodSeconds) {
        this.gracePeriodSeconds = gracePeriodSeconds;
    }

    /**
     * Returns the cron schedule for cleaning up expired tokens.
     *
     * @return the cleanup cron expression
     */
    public String getCleanupSchedule() {
        return cleanupSchedule;
    }

    /**
     * Sets the cron schedule for cleaning up expired tokens.
     *
     * @param cleanupSchedule the cleanup cron expression
     */
    public void setCleanupSchedule(String cleanupSchedule) {
        this.cleanupSchedule = cleanupSchedule;
    }
}
