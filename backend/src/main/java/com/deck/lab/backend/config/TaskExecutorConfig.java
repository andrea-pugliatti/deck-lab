package com.deck.lab.backend.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Spring configuration class registering thread pool task executors for
 * asynchronous tasks.
 *
 * <p>
 * Configures distinct, named beans for running background operations:
 * <ul>
 * <li>{@code imageDownloadExecutor}: Applied to external image fetching and
 * caching tasks.</li>
 * <li>{@code databaseSeederExecutor}: Applied to non-blocking startup database
 * seeding operations.</li>
 * </ul>
 * </p>
 */
@Configuration
public class TaskExecutorConfig {

    /**
     * Configures a thread pool task executor dedicated to concurrently downloading
     * and caching card artwork images from external sources.
     *
     * <p>
     * Features:
     * <ul>
     * <li>Core pool size: 5 threads</li>
     * <li>Maximum pool size: 5 threads</li>
     * <li>Queue capacity: {@link Integer#MAX_VALUE}</li>
     * <li>Thread name prefix: {@code image-downloader-}</li>
     * <li>Rejected execution policy:
     * {@link ThreadPoolExecutor.CallerRunsPolicy}</li>
     * <li>Graceful shutdown: waits up to 30 seconds for tasks to complete</li>
     * </ul>
     * </p>
     *
     * @return the configured {@link ThreadPoolTaskExecutor} for image downloading
     */
    @Bean(name = "imageDownloadExecutor")
    public ThreadPoolTaskExecutor imageDownloadExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(Integer.MAX_VALUE);
        executor.setThreadNamePrefix("image-downloader-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }

    /**
     * Configures a single-threaded executor dedicated to performing database
     * seeding tasks on application startup.
     *
     * <p>
     * Features:
     * <ul>
     * <li>Core pool size: 1 thread</li>
     * <li>Maximum pool size: 1 thread</li>
     * <li>Queue capacity: 1 task</li>
     * <li>Thread name prefix: {@code db-seeder-}</li>
     * </ul>
     * </p>
     *
     * @return the configured {@link ThreadPoolTaskExecutor} for database seeding
     */
    @Bean(name = "databaseSeederExecutor")
    public ThreadPoolTaskExecutor databaseSeederExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(1);
        executor.setQueueCapacity(1);
        executor.setThreadNamePrefix("db-seeder-");
        executor.initialize();
        return executor;
    }
}
