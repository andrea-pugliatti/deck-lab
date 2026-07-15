package com.deck.lab.backend.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;

/**
 * JPA Repository interface for {@link FormatRules} database entities.
 * 
 * <p>
 * <b>Spring Cache Integration:</b> Database queries to read banlist/format limits are frequent but
 * change rarely. By annotating the query method with {@link Cacheable}, Spring intercepts calls to
 * this method: if a query for a format (e.g. "GOAT") has been run before, Spring returns the cached
 * result directly from memory instead of running a SQL SELECT statement, improving API speed.
 * </p>
 */
public interface FormatRulesRepository extends JpaRepository<FormatRules, Long> {

    /**
     * Resolves all card limitation rules assigned to a specific format. Results are cached using
     * formatName as key.
     *
     * @param formatName the format Enum (e.g. TCG, GOAT)
     * @return a list of matching rules
     */
    @Cacheable(value = "formatRules", key = "#formatName")
    List<FormatRules> findByFormatName(Format formatName);
}
