package com.deck.lab.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.deck.lab.backend.dto.CardDto;
import com.deck.lab.backend.mapper.CardMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.service.CardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService service;
    private final CardMapper mapper;

    CardController(
            CardService cardService,
            CardMapper cardMapper) {
        this.service = cardService;
        this.mapper = cardMapper;
    }

    @GetMapping
    public ResponseEntity<Page<CardDto>> index(
            @RequestParam(value = "q", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "attribute", required = false) String attribute,
            @RequestParam(value = "race", required = false) String race,
            @RequestParam(value = "archetype", required = false) String archetype,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CardDto> cards = service
                .findAllOrWithFilters(name, type, attribute, race, archetype, pageable)
                .map(mapper::toDto);

        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDto> show(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toDto(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<CardDto> create(@Valid @RequestBody CardDto cardDto) {
        Card card = mapper.toEntity(cardDto);
        Card savedCard = service.save(card);
        return new ResponseEntity<>(mapper.toDto(savedCard), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardDto> update(@PathVariable Long id, @Valid @RequestBody CardDto cardDto) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Card existingCard = service.getById(id);
        mapper.updateEntityFromDto(cardDto, existingCard);
        Card updatedCard = service.edit(existingCard);
        return ResponseEntity.ok(mapper.toDto(updatedCard));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attributes")
    public ResponseEntity<List<String>> getAttributes() {
        return ResponseEntity.ok(service.findDistinctAttributes());
    }

    @GetMapping("/races")
    public ResponseEntity<List<String>> getRaces() {
        return ResponseEntity.ok(service.findDistinctRaces());

    }

    @GetMapping("/archetypes")
    public ResponseEntity<List<String>> getArchetypes() {
        return ResponseEntity.ok(service.findDistinctArchetypes());

    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        return ResponseEntity.ok(service.findDistinctTypes());

    }
}
