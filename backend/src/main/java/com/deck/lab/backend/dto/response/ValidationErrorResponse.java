package com.deck.lab.backend.dto.response;

import java.util.List;

public class ValidationErrorResponse {
    private String message;
    private List<String> errors;

    public ValidationErrorResponse() {
    }

    public ValidationErrorResponse(String message, List<String> errors) {
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
