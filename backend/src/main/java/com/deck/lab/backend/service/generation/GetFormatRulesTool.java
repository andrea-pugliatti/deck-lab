package com.deck.lab.backend.service.generation;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.FormatRules;
import com.deck.lab.backend.repository.FormatRulesRepository;

/**
 * Tool function enabling the AI model to query database rules (banlists) for a format.
 */
public class GetFormatRulesTool implements Function<GetFormatRulesTool.FormatRulesRequest, GetFormatRulesTool.FormatRulesResponse> {

    private final FormatRulesRepository formatRulesRepository;

    public GetFormatRulesTool(FormatRulesRepository formatRulesRepository) {
        this.formatRulesRepository = formatRulesRepository;
    }

    @Override
    public FormatRulesResponse apply(FormatRulesRequest request) {
        if (request.format() == null || request.format().isBlank()) {
            return new FormatRulesResponse(null, List.of(), "Format name is empty.");
        }

        Format format;
        try {
            format = Format.fromString(request.format().trim());
        } catch (IllegalArgumentException e) {
            return new FormatRulesResponse(request.format(), List.of(), "Unknown format: " + request.format() + ". Supported: GOAT, EDISON, TENGU_PLANT, HAT, OCG, TCG.");
        }

        List<FormatRules> rules = formatRulesRepository.findByFormatName(format);
        List<FormatRuleInfo> ruleInfos = new ArrayList<>();
        if (rules != null) {
            for (FormatRules rule : rules) {
                if (rule.getCard() != null) {
                    ruleInfos.add(new FormatRuleInfo(
                            rule.getCard().getName(),
                            rule.getStatus() != null ? rule.getStatus().name() : "UNKNOWN"
                    ));
                }
            }
        }

        return new FormatRulesResponse(format.name(), ruleInfos, null);
    }

    public record FormatRulesRequest(String format) {}

    public record FormatRuleInfo(String cardName, String status) {}

    public record FormatRulesResponse(String format, List<FormatRuleInfo> rules, String error) {}
}
