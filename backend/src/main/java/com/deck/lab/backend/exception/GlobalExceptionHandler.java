package com.deck.lab.backend.exception;

import java.net.URI;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.validation.ConstraintViolationException;

/**
 * Global API Exception Handler coordinating centralized error handling across REST controllers
 * using standard RFC 7807 {@link ProblemDetail} responses.
 *
 * <p>
 * <b>REST Controller Advice Pattern:</b> Instead of wrapping controller endpoints in duplicate
 * try-catch blocks, Spring uses the {@link RestControllerAdvice} interceptor pattern. By extending
 * {@link ResponseEntityExceptionHandler}, standard Spring MVC exceptions are formatted into
 * RFC 7807 Problem Details while custom exceptions are mapped explicitly to standardized HTTP
 * status codes and error payloads.
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final URI BLANK_TYPE = URI.create("about:blank");

    /**
     * Intercepts and handles {@link ResourceNotFoundException} errors when resources are missing.
     * Maps them to an RFC 7807 404 Not Found {@link ProblemDetail}.
     *
     * @param ex the caught resource not found exception
     * @return 404 Not Found problem detail
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setType(BLANK_TYPE);
        return problemDetail;
    }

    /**
     * Intercepts and handles {@link DeckValidationException} validation errors.
     * Maps them to an RFC 7807 400 Bad Request {@link ProblemDetail} with an errors list property.
     *
     * @param ex the caught validation exception
     * @return 400 Bad Request problem detail with errors list
     */
    @ExceptionHandler(DeckValidationException.class)
    public ProblemDetail handleDeckValidationException(DeckValidationException ex) {
        List<String> errors = ex.getErrors() != null
                ? ex.getErrors().stream()
                        .filter(error -> error != null)
                        .map(error -> error.message() != null ? error.message() : "Validation failed")
                        .toList()
                : List.of();

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Validation failed for deck list");
        problemDetail.setTitle("Deck Validation Failed");
        problemDetail.setType(BLANK_TYPE);
        problemDetail.setProperty("errors", errors);
        return problemDetail;
    }

    /**
     * Overrides default {@link MethodArgumentNotValidException} handling to provide structured
     * field validation error messages within an RFC 7807 Problem Detail.
     *
     * @param ex      the caught method argument validation exception
     * @param headers the HTTP headers for the response
     * @param status  the HTTP status code
     * @param request the current web request
     * @return response entity containing the RFC 7807 problem detail
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        List<String> errors = ex.getBindingResult() != null && ex.getBindingResult().getFieldErrors() != null
                ? ex.getBindingResult().getFieldErrors().stream()
                        .filter(error -> error != null)
                        .map(error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Validation error")
                        .toList()
                : List.of();

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Validation failed for one or more fields");
        problemDetail.setTitle("Validation Failed");
        problemDetail.setType(BLANK_TYPE);
        problemDetail.setProperty("errors", errors);

        return handleExceptionInternal(ex, problemDetail, headers, status, request);
    }

    /**
     * Intercepts and handles {@link ConstraintViolationException} parameter validation errors.
     *
     * @param ex the caught constraint violation exception
     * @return 400 Bad Request problem detail with violation errors list
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations() != null
                ? ex.getConstraintViolations().stream()
                        .filter(violation -> violation != null)
                        .map(violation -> violation.getMessage() != null ? violation.getMessage() : "Constraint violation")
                        .toList()
                : List.of();

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Validation failed for request parameters");
        problemDetail.setTitle("Constraint Violation");
        problemDetail.setType(BLANK_TYPE);
        problemDetail.setProperty("errors", errors);
        return problemDetail;
    }

    /**
     * Intercepts {@link YdkImportException} errors when .ydk file import or parsing fails.
     *
     * @param ex the caught import exception
     * @return 400 Bad Request problem detail with import error details
     */
    @ExceptionHandler(YdkImportException.class)
    public ProblemDetail handleYdkImportException(YdkImportException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problemDetail.setTitle("YDK Import Failed");
        problemDetail.setType(BLANK_TYPE);
        problemDetail.setProperty("errors", List.of(ex.getMessage()));
        return problemDetail;
    }

    /**
     * Intercepts {@link TokenRefreshException} errors when token validation fails.
     *
     * @param ex the caught token refresh exception
     * @return 403 Forbidden problem detail
     */
    @ExceptionHandler(TokenRefreshException.class)
    public ProblemDetail handleTokenRefreshException(TokenRefreshException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN, ex.getMessage());
        problemDetail.setTitle("Token Refresh Failed");
        problemDetail.setType(BLANK_TYPE);
        return problemDetail;
    }

    /**
     * Intercepts {@link IllegalArgumentException} errors for illegal or inappropriate arguments.
     *
     * @param ex the caught illegal argument exception
     * @return 400 Bad Request problem detail
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problemDetail.setTitle("Invalid Argument");
        problemDetail.setType(BLANK_TYPE);
        return problemDetail;
    }

    /**
     * Catch-all handler for unhandled exceptions, returning a safe 500 Internal Server Error problem detail.
     *
     * @param ex the uncaught exception
     * @return 500 Internal Server Error problem detail
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneralException(Exception ex) {
        log.error("Unhandled internal server exception", ex);
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setType(BLANK_TYPE);
        return problemDetail;
    }
}
