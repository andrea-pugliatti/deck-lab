package com.deck.lab.backend.controller;

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

import com.deck.lab.backend.dto.CardDto;
import com.deck.lab.backend.mapper.CardMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.service.CardService;

import jakarta.validation.Valid;
import java.util.List;

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
    public ResponseEntity<List<CardDto>> index(
            @RequestParam(value = "q", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "attribute", required = false) String attribute,
            @RequestParam(value = "race", required = false) String race,
            @RequestParam(value = "archetype", required = false) String archetype) {
        List<CardDto> cards = service
                .findAllOrWithFilters(name, type, attribute, race, archetype)
                .stream()
                .map(mapper::toDto)
                .toList();
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDto> show(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(
                mapper.toDto(service.getById(id)),
                HttpStatus.OK);
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
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Card existingCard = service.getById(id);
        mapper.updateEntityFromDto(cardDto, existingCard);
        Card updatedCard = service.edit(existingCard);
        return new ResponseEntity<>(mapper.toDto(updatedCard), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
