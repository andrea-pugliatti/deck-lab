package com.deck.lab.backend.service.generation.tool.dto;

import java.util.List;

/**
 * Response record containing list of rules and size boundaries.
 */
public record FormatRulesResponse(
        String format,
        List<FormatRuleInfo> rules,
        Integer minMainSize,
        Integer maxMainSize,
        Integer maxExtraSize,
        Integer maxSideSize,
        String error) {
    public FormatRulesResponse(String format, List<FormatRuleInfo> rules, String error) {
        this(format, rules, null, null, null, null, error);
    }
}