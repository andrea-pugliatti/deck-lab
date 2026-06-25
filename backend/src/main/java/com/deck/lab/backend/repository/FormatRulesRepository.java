package com.deck.lab.backend.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.deck.lab.backend.model.FormatRules;

public interface FormatRulesRepository extends JpaRepository<FormatRules, Long> {
    @Cacheable(value = "formatRules", key = "#formatName")
    List<FormatRules> findByFormatName(String formatName);

    List<FormatRules> findDistinctByFormatNameNotNull();
}
