package com.deck.lab.backend.service.generation;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.jpa.domain.Specification;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.specification.CardSpecification;

/**
 * Tool function enabling the AI model to query all cards matching a specific
 * archetype from the database.
 */
public class GetArchetypeCardsTool
        implements Function<ArchetypeCardsRequest, ArchetypeCardsResponse> {

    private final CardRepository cardRepository;

    public GetArchetypeCardsTool(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Executes the archetype query tool, retrieving up to 30 cards matching a
     * target archetype.
     *
     * @param request the archetype cards request containing the target archetype
     *                name
     * @return a structured ArchetypeCardsResponse with matching card details
     */
    @Override
    public ArchetypeCardsResponse apply(ArchetypeCardsRequest request) {
        if (request.archetype() == null || request.archetype().isBlank()) {
            return new ArchetypeCardsResponse(null, List.of());
        }

        Specification<Card> spec = CardSpecification.hasArchetype(request.archetype().trim());
        List<Card> cards = cardRepository.findAll(spec);

        // Limit results to 30 to prevent context overflow in LLM conversation
        List<ArchetypeCardInfo> cardInfos = cards.stream()
                .limit(30)
                .map(c -> new ArchetypeCardInfo(
                        c.getName(),
                        c.getType() != null ? c.getType().getValue() : null,
                        c.getAttribute() != null ? c.getAttribute().getValue() : null))
                .toList();

        return new ArchetypeCardsResponse(request.archetype(), cardInfos);
    }
}
