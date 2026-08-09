package com.deck.lab.backend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.deck.lab.backend.dto.response.DeckCardResponseDto;
import com.deck.lab.backend.dto.response.DeckResponseDto;
import com.deck.lab.backend.dto.response.YdkImportResponseDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.repository.CardRepository;

/**
 * Service for parsing, importing, and exporting Yu-Gi-Oh! deck files in `.ydk` format.
 */
@Service
@Transactional
public class YdkService {

    private final CardRepository cardRepository;
    private final DeckService deckService;

    public YdkService(CardRepository cardRepository, DeckService deckService) {
        this.cardRepository = cardRepository;
        this.deckService = deckService;
    }

    /**
     * Parses a `.ydk` content string, resolves card passcodes against the database, and constructs
     * a populated {@link YdkImportResponseDto}.
     *
     * @param content raw `.ydk` text file content
     * @return YdkImportResponseDto containing deck details and warnings for unmapped passcodes
     */
    public YdkImportResponseDto importYdk(String content) {
        if (content == null || content.isBlank()) {
            DeckResponseDto emptyDeck = new DeckResponseDto();
            emptyDeck.setName("Imported Deck");
            emptyDeck.setFormatName(Format.TCG);
            return new YdkImportResponseDto(emptyDeck, List.of());
        }

        List<String> warnings = new ArrayList<>();
        Map<DeckSection, List<Long>> sectionPasscodesMap = new LinkedHashMap<>();
        sectionPasscodesMap.put(DeckSection.MAIN, new ArrayList<>());
        sectionPasscodesMap.put(DeckSection.EXTRA, new ArrayList<>());
        sectionPasscodesMap.put(DeckSection.SIDE, new ArrayList<>());

        DeckSection currentSection = DeckSection.MAIN;

        try (BufferedReader reader = new BufferedReader(new StringReader(content))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                if (trimmed.startsWith("#main")) {
                    currentSection = DeckSection.MAIN;
                    continue;
                }
                if (trimmed.startsWith("#extra")) {
                    currentSection = DeckSection.EXTRA;
                    continue;
                }
                if (trimmed.startsWith("!side")) {
                    currentSection = DeckSection.SIDE;
                    continue;
                }
                if (trimmed.startsWith("#") || trimmed.startsWith("!")) {
                    continue;
                }

                try {
                    Long passcode = Long.parseLong(trimmed);
                    sectionPasscodesMap.get(currentSection).add(passcode);
                } catch (NumberFormatException e) {
                    // Ignore non-numeric lines
                }
            }
        } catch (IOException e) {
            warnings.add("Failed to parse YDK content: " + e.getMessage());
        }

        List<Long> allPasscodes = sectionPasscodesMap.values()
                .stream()
                .flatMap(s -> s.stream())
                .distinct()
                .toList();

        Map<Long, Card> cardPasscodeMap = cardRepository.findByPasscodeIn(allPasscodes)
                .stream()
                .filter(c -> c.getPasscode() != null)
                .collect(Collectors
                        .toMap(c -> c.getPasscode(), c -> c, (existing, replacement) -> existing));

        List<DeckCardResponseDto> deckCardDtos = new ArrayList<>();

        for (Map.Entry<DeckSection, List<Long>> entry : sectionPasscodesMap.entrySet()) {
            DeckSection section = entry.getKey();
            List<Long> passcodes = entry.getValue();

            Map<Long, Integer> counts = new LinkedHashMap<>();
            for (Long passcode : passcodes) {
                counts.put(passcode, counts.getOrDefault(passcode, 0) + 1);
            }

            for (Map.Entry<Long, Integer> countEntry : counts.entrySet()) {
                Long passcode = countEntry.getKey();
                Integer qty = countEntry.getValue();

                Card card = cardPasscodeMap.get(passcode);
                if (card == null) {
                    warnings.add("Passcode " + passcode + " not found in database.");
                } else {
                    DeckCardResponseDto dto = new DeckCardResponseDto();
                    dto.setCardId(card.getId());
                    dto.setName(card.getName());
                    dto.setType(card.getType());
                    dto.setDescription(card.getDescription());
                    dto.setRace(card.getRace());
                    dto.setAttribute(card.getAttribute());
                    dto.setArchetype(card.getArchetype());
                    dto.setImageUrl(card.getImageUrl());
                    dto.setSection(section);
                    dto.setQuantity(qty);
                    deckCardDtos.add(dto);
                }
            }
        }

        DeckResponseDto deckDto = new DeckResponseDto();
        deckDto.setName("Imported Deck");
        deckDto.setFormatName(Format.TCG);
        deckDto.setCards(deckCardDtos);

        return new YdkImportResponseDto(deckDto, warnings);
    }

    /**
     * Serializes a deck into `.ydk` file format string by deck ID.
     *
     * @param deckId unique deck ID
     * @return standard `.ydk` text string
     */
    public String exportYdk(Long deckId) {
        DeckResponseDto deck = deckService.getDeckById(deckId);

        StringBuilder sb = new StringBuilder();
        sb.append("#created by DeckLab\n");

        List<DeckCardResponseDto> cardDtos = deck.getCards();
        if (cardDtos == null || cardDtos.isEmpty()) {
            cardDtos = new ArrayList<>();
        }

        sb.append("#main\n");
        appendSectionPasscodes(sb, cardDtos, DeckSection.MAIN);

        sb.append("#extra\n");
        appendSectionPasscodes(sb, cardDtos, DeckSection.EXTRA);

        sb.append("!side\n");
        appendSectionPasscodes(sb, cardDtos, DeckSection.SIDE);

        return sb.toString();
    }

    private void appendSectionPasscodes(StringBuilder sb, List<DeckCardResponseDto> cards,
                                        DeckSection section) {
        for (DeckCardResponseDto cardDto : cards) {
            if (cardDto.getSection() == section && cardDto.getCardId() != null) {
                Optional<Card> cardOpt = cardRepository.findById(cardDto.getCardId());
                if (cardOpt.isPresent() && cardOpt.get().getPasscode() != null) {
                    Long passcode = cardOpt.get().getPasscode();
                    int qty = cardDto.getQuantity() != null
                            ? cardDto.getQuantity()
                            : 1;
                    for (int i = 0; i < qty; i++) {
                        sb.append(passcode).append("\n");
                    }
                }
            }
        }
    }
}
