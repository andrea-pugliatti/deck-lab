package com.deck.lab.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.deck.lab.backend.dto.response.ValidationErrorResponse;
import com.deck.lab.backend.validation.ValidationError;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DeckValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleDeckValidationException(DeckValidationException ex) {
        List<String> errors = ex.getErrors()
                .stream()
                .map(ValidationError::message)
                .collect(Collectors.toList());

        ValidationErrorResponse response = new ValidationErrorResponse("Validation failed", errors);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Void> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.notFound().build();
    }
}
