package com.deck.lab.backend.service.generation.tool;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.CardType;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.service.generation.tool.dto.DeckStatsRequest;
import com.deck.lab.backend.service.generation.tool.dto.DeckStatsResponse;

/**
 * Tool function enabling the AI model to analyze distributions and metrics
 * (Monster/Spell/Trap ratios, average ATK/DEF, levels) of a list of card names.
 */
public class AnalyzeDeckStatsTool
        implements Function<DeckStatsRequest, DeckStatsResponse> {

    private final CardRepository cardRepository;

    public AnalyzeDeckStatsTool(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Executes the statistics analysis tool, computing attribute distributions,
     * type percentage ratios, and averages (ATK, DEF, Level) for a list of card
     * names.
     *
     * @param request the stats analysis request containing target card names
     * @return a structured DeckStatsResponse containing computed ratios and metrics
     */
    @Override
    public DeckStatsResponse apply(DeckStatsRequest request) {
        if (request.cardNames() == null || request.cardNames().isEmpty()) {
            return new DeckStatsResponse(0, 0, 0.0, 0, 0.0, 0, 0.0, 0.0, 0.0, 0.0, Map.of(), Map.of());
        }

        int totalCards = request.cardNames().size();
        int monsterCount = 0;
        int spellCount = 0;
        int trapCount = 0;

        int totalAtk = 0;
        int totalDef = 0;
        int totalLevel = 0;
        int monsterWithStatsCount = 0;

        Map<String, Integer> attributes = new HashMap<>();
        Map<String, Integer> archetypes = new HashMap<>();

        for (String name : request.cardNames()) {
            if (name == null || name.isBlank()) {
                continue;
            }

            Optional<Card> cardOpt = cardRepository.findByName(name.trim());
            if (cardOpt.isEmpty()) {
                List<Card> fallbacks = cardRepository.findByNameContainingIgnoreCase(name.trim());
                if (!fallbacks.isEmpty()) {
                    cardOpt = Optional.of(fallbacks.get(0));
                }
            }

            if (cardOpt.isPresent()) {
                Card c = cardOpt.get();
                CardType type = c.getType();

                if (type == CardType.SPELL_CARD) {
                    spellCount++;
                } else if (type == CardType.TRAP_CARD) {
                    trapCount++;
                } else {
                    monsterCount++;
                    // Calculate monster stats
                    if (c.getAtk() != null) {
                        totalAtk += c.getAtk();
                    }
                    if (c.getDef() != null) {
                        totalDef += c.getDef();
                    }
                    if (c.getLevel() != null) {
                        totalLevel += c.getLevel();
                    }
                    monsterWithStatsCount++;
                }

                if (c.getAttribute() != null) {
                    String attr = c.getAttribute().getValue();
                    attributes.put(attr, attributes.getOrDefault(attr, 0) + 1);
                }

                if (c.getArchetype() != null && !c.getArchetype().isBlank()) {
                    String arch = c.getArchetype();
                    archetypes.put(arch, archetypes.getOrDefault(arch, 0) + 1);
                }
            }
        }

        double monsterPct = totalCards > 0 ? (double) monsterCount / totalCards * 100 : 0.0;
        double spellPct = totalCards > 0 ? (double) spellCount / totalCards * 100 : 0.0;
        double trapPct = totalCards > 0 ? (double) trapCount / totalCards * 100 : 0.0;

        double averageAtk = monsterWithStatsCount > 0 ? (double) totalAtk / monsterWithStatsCount : 0.0;
        double averageDef = monsterWithStatsCount > 0 ? (double) totalDef / monsterWithStatsCount : 0.0;
        double averageLevel = monsterWithStatsCount > 0 ? (double) totalLevel / monsterWithStatsCount : 0.0;

        return new DeckStatsResponse(
                totalCards,
                monsterCount,
                monsterPct,
                spellCount,
                spellPct,
                trapCount,
                trapPct,
                averageAtk,
                averageDef,
                averageLevel,
                attributes,
                archetypes);
    }
}
