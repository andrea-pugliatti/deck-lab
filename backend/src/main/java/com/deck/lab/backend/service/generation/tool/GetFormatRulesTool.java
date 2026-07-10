package com.deck.lab.backend.service.generation.tool;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.FormatRulesRepository;
import com.deck.lab.backend.validation.rules.FormatDeckLimits;
import com.deck.lab.backend.validation.rules.DeckSizeLimits;
import com.deck.lab.backend.service.generation.tool.dto.FormatRulesRequest;
import com.deck.lab.backend.service.generation.tool.dto.FormatRulesResponse;
import com.deck.lab.backend.service.generation.tool.dto.FormatRuleInfo;

/**
 * Tool function enabling the AI model to query database rules (banlists) for a
 * format.
 */
public class GetFormatRulesTool implements Function<FormatRulesRequest, FormatRulesResponse> {

    private final FormatRulesRepository formatRulesRepository;

    public GetFormatRulesTool(FormatRulesRepository formatRulesRepository) {
        this.formatRulesRepository = formatRulesRepository;
    }

    /**
     * Executes the format rules retrieval tool, querying database rules and deck
     * sizes.
     *
     * @param request the format rules request containing the target format name
     * @return a structured FormatRulesResponse containing banlist data and sizes
     */
    @Override
    public FormatRulesResponse apply(FormatRulesRequest request) {
        if (request.format() == null || request.format().isBlank()) {
            return new FormatRulesResponse(null, List.of(), "Format name is empty.");
        }

        Format format;
        try {
            format = Format.fromString(request.format().trim());
        } catch (IllegalArgumentException e) {
            return new FormatRulesResponse(request.format(), List.of(),
                    "Unknown format: " + request.format() + ". Supported: GOAT, EDISON, TENGU_PLANT, HAT, OCG, TCG.");
        }

        List<FormatRules> rules = formatRulesRepository.findByFormatName(format);
        List<FormatRuleInfo> ruleInfos = new ArrayList<>();
        if (rules != null) {
            for (FormatRules rule : rules) {
                if (rule.getCard() != null) {
                    ruleInfos.add(new FormatRuleInfo(
                            rule.getCard().getName(),
                            rule.getStatus() != null ? rule.getStatus().name() : "UNKNOWN"));
                }
            }
        }

        DeckSizeLimits limits = FormatDeckLimits.getLimits(format);

        return new FormatRulesResponse(
                format.name(),
                ruleInfos,
                limits.minMainSize(),
                limits.maxMainSize(),
                limits.maxExtraSize(),
                limits.maxSideSize(),
                null);
    }
}
