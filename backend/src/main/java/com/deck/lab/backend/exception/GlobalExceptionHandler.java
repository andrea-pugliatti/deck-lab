package com.deck.lab.backend.exception;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.deck.lab.backend.dto.response.ValidationErrorResponseDto;

import jakarta.validation.ConstraintViolationException;

/**
 * Global API Exception Handler coordinating centralized error parsing across REST Controllers.
 * 
 * <p>
 * <b>REST Controller Advice Pattern:</b> Instead of wrapping controller endpoints in duplicate
 * try-catch blocks, Spring uses the {@link RestControllerAdvice} interceptor pattern. Methods
 * decorated with {@link ExceptionHandler} catch matching thrown exceptions automatically,
 * formatting them into clean JSON response bodies and returning correct HTTP status codes to the
 * client.
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Intercepts and handles {@link DeckValidationException} validation errors. Extracts errors and
     * returns a 400 Bad Request with a structured {@link ValidationErrorResponseDto}.
     *
     * @param ex the caught validation exception
     * @return 400 Bad Request with details
     */
    @ExceptionHandler(DeckValidationException.class)
    public ResponseEntity<ValidationErrorResponseDto>
            handleDeckValidationException(DeckValidationException ex) {
        List<String> errors = ex.getErrors().stream()
                .map(error -> error.message())
                .toList();

        ValidationErrorResponseDto response = new ValidationErrorResponseDto(
                "Validation failed", errors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Intercepts JSR-380 validation failures on request parameters or bodies (e.g. @NotNull, @Max).
     * Returns a 400 Bad Request with a structured ValidationErrorResponseDto, preventing standard
     * Spring MVC /error forwards.
     *
     * @param ex the caught MethodArgumentNotValidException
     * @return 400 Bad Request with detailed field validation messages
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponseDto>
            handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .toList();

        ValidationErrorResponseDto response = new ValidationErrorResponseDto(
                "Validation failed", errors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Intercepts constraint violation exceptions.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationErrorResponseDto>
            handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .toList();

        ValidationErrorResponseDto response = new ValidationErrorResponseDto(
                "Validation failed", errors);
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Intercepts {@link NoSuchElementException} errors when resources are missing or unauthorized.
     * Maps them directly to a 404 Not Found response.
     *
     * @param ex the caught missing element exception
     * @return 404 Not Found status response
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Void> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.notFound().build();
    }
}
