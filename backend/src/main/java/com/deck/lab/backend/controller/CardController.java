package com.deck.lab.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import com.deck.lab.backend.dto.CardDTO;
import com.deck.lab.backend.mapper.CardMapper;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.service.CardService;

import jakarta.validation.Valid;
import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private static final Logger logger = LoggerFactory.getLogger(CardController.class);

    private final CardService service;
    private final CardMapper mapper;

    CardController(
            CardService cardService,
            CardMapper cardMapper) {
        this.service = cardService;
        this.mapper = cardMapper;
    }

    @GetMapping
    public ResponseEntity<List<CardDTO>> index(
            @RequestParam(value = "q", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "attribute", required = false) String attribute,
            @RequestParam(value = "race", required = false) String race,
            @RequestParam(value = "archetype", required = false) String archetype) {
        List<CardDTO> cards = service
                .findAllOrWithFilters(name, type, attribute, race, archetype)
                .stream()
                .map(mapper::toDto)
                .toList();
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDTO> show(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(
                mapper.toDto(service.getById(id)),
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CardDTO> create(@Valid @RequestBody CardDTO cardDTO) {
        Card card = mapper.toEntity(cardDTO);
        Card savedCard = service.save(card);
        return new ResponseEntity<>(mapper.toDto(savedCard), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardDTO> update(@PathVariable Long id, @Valid @RequestBody CardDTO cardDTO) {
        if (!service.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Card existingCard = service.getById(id);
        mapper.updateEntityFromDto(cardDTO, existingCard);
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

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getFullImage(@PathVariable String filename) {
        return serveImage(filename, "");
    }

    @GetMapping("/images/cropped/{filename:.+}")
    public ResponseEntity<Resource> getCroppedImage(@PathVariable String filename) {
        return serveImage(filename, "cropped/");
    }

    private ResponseEntity<Resource> serveImage(String filename, String subDir) {
        File file = new File("cards/images/" + subDir + filename);
        if (!file.exists()) {
            logger.debug("Image file not found: {}", file.getAbsolutePath());
            return ResponseEntity.notFound().build();
        }
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}
