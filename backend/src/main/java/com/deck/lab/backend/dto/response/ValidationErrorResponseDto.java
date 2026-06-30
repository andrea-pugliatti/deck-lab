package com.deck.lab.backend.dto.response;

import java.util.List;

/**
 * Data Transfer Object (DTO) conveying localized input validation errors.
 *
 * <p>
 * <strong>Response DTO</strong>
 * </p>
 * <p>
 * This object is returned by the global exception handler when the incoming
 * payloads fail Jakarta bean validation. It provides a structured structure
 * containing a general error message and a collection of specific validation
 * errors (e.g. "quantity cannot exceed 3"). Having a unified validation error
 * response format allows the client-side forms to parse and highlight specific
 * fields containing invalid entries.
 * </p>
 */
public class ValidationErrorResponseDto {
    private String message;
    private List<String> errors;

    public ValidationErrorResponseDto() {
    }

    public ValidationErrorResponseDto(String message, List<String> errors) {
        this.message = message;
        this.errors = errors;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
