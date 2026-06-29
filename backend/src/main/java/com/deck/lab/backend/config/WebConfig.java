package com.deck.lab.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class customizing Spring MVC web settings and static resource
 * handlers.
 *
 * <ul>
 * <li>{@code @Configuration}: Designates this class as a developer-driven bean
 * definition configuration source.</li>
 * <li>{@link WebMvcConfigurer}: The core configuration callback interface in
 * Spring MVC. Implementing this interface allows overriding defaults without
 * taking over Spring Boot's auto-configurations. We override
 * {@code addResourceHandlers} to map a public HTTP endpoint namespace
 * ({@code /api/cards/images/**}) directly to a local filesystem folder (defined
 * by {@code uploadDir}), enabling the server to serve cached card artwork
 * files.</li>
 * <li>{@code @EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)}:
 * Configures how Spring Data pagination objects (like {@link Page}) are
 * serialized over HTTP. Setting the mode to {@code VIA_DTO} translates the
 * internal page classes to clean JSON DTO structures, avoiding leakage of
 * framework internal details and maintaining client-side compatibility.</li>
 * </ul>
 */
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir:data/images}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/api/cards/images/**")
                .addResourceLocations("file:" + path.toString() + "/");
    }
}
