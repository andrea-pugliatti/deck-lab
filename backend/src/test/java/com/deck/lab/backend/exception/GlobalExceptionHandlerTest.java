package com.deck.lab.backend.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import com.deck.lab.backend.validation.ValidationError;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@DisplayName("GlobalExceptionHandler Unit Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("handleResourceNotFoundException should return 404 ProblemDetail with message")
    void handleResourceNotFoundException_shouldReturnNotFoundProblemDetail_whenResourceNotFound() {
        // Arrange
        ResourceNotFoundException exception = new ResourceNotFoundException("Card not found with id: 42");

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleResourceNotFoundException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Resource Not Found");
        assertThat(problemDetail.getDetail()).isEqualTo("Card not found with id: 42");
    }

    @Test
    @DisplayName("handleDeckValidationException should return 400 ProblemDetail with error list")
    void handleDeckValidationException_shouldReturnBadRequestProblemDetailWithErrors_whenValidationFails() {
        // Arrange
        List<ValidationError> errors = List.of(
                new ValidationError("Main deck must contain at least 40 cards"),
                new ValidationError("Pot of Greed is forbidden in TCG format"));
        DeckValidationException exception = new DeckValidationException(errors);

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleDeckValidationException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Deck Validation Failed");
        assertThat(problemDetail.getDetail()).isEqualTo("Validation failed for deck list");
        assertThat(problemDetail.getProperties()).isNotNull();

        @SuppressWarnings("unchecked")
        List<String> errorMessages = (List<String>) problemDetail.getProperties().get("errors");
        assertThat(errorMessages).containsExactly(
                "Main deck must contain at least 40 cards",
                "Pot of Greed is forbidden in TCG format");
    }

    @Test
    @DisplayName("handleDeckValidationException should handle null errors gracefully")
    void handleDeckValidationException_shouldHandleNullErrorsGracefully() {
        // Arrange
        DeckValidationException exception = new DeckValidationException(null);

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleDeckValidationException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());

        @SuppressWarnings("unchecked")
        List<String> errorMessages = (List<String>) problemDetail.getProperties().get("errors");
        assertThat(errorMessages).isEmpty();
    }

    @Test
    @DisplayName("handleMethodArgumentNotValid should return 400 ProblemDetail with field errors")
    void handleMethodArgumentNotValid_shouldReturnBadRequestWithFieldErrors_whenValidationFails() {
        // Arrange
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("deckDto", "name", "must not be blank");
        FieldError fieldError2 = new FieldError("deckDto", "formatName", "must not be null");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

        MethodParameter methodParameter = mock(MethodParameter.class);
        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(methodParameter, bindingResult);
        WebRequest webRequest = mock(WebRequest.class);

        // Act
        ResponseEntity<Object> responseEntity = exceptionHandler.handleMethodArgumentNotValid(
                exception, new HttpHeaders(), HttpStatus.BAD_REQUEST, webRequest);

        // Assert
        assertThat(responseEntity).isNotNull();
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).isInstanceOf(ProblemDetail.class);

        ProblemDetail problemDetail = (ProblemDetail) responseEntity.getBody();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Validation Failed");
        assertThat(problemDetail.getDetail()).isEqualTo("Validation failed for one or more fields");

        @SuppressWarnings("unchecked")
        List<String> errorMessages = (List<String>) problemDetail.getProperties().get("errors");
        assertThat(errorMessages).containsExactly("must not be blank", "must not be null");
    }

    @Test
    @DisplayName("handleConstraintViolationException should return 400 ProblemDetail with violation errors")
    void handleConstraintViolationException_shouldReturnBadRequestWithViolationErrors_whenConstraintViolated() {
        // Arrange
        ConstraintViolation<?> violation1 = mock(ConstraintViolation.class);
        when(violation1.getMessage()).thenReturn("page must be greater than or equal to 0");
        ConstraintViolationException exception = new ConstraintViolationException("Invalid parameter", Set.of(violation1));

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleConstraintViolationException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Constraint Violation");
        assertThat(problemDetail.getDetail()).isEqualTo("Validation failed for request parameters");

        @SuppressWarnings("unchecked")
        List<String> errorMessages = (List<String>) problemDetail.getProperties().get("errors");
        assertThat(errorMessages).containsExactly("page must be greater than or equal to 0");
    }

    @Test
    @DisplayName("handleYdkImportException should return 400 ProblemDetail with import error details")
    void handleYdkImportException_shouldReturnBadRequestWithErrors_whenImportFails() {
        // Arrange
        YdkImportException exception = new YdkImportException("Corrupt YDK file header");

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleYdkImportException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problemDetail.getTitle()).isEqualTo("YDK Import Failed");
        assertThat(problemDetail.getDetail()).isEqualTo("Corrupt YDK file header");

        @SuppressWarnings("unchecked")
        List<String> errorMessages = (List<String>) problemDetail.getProperties().get("errors");
        assertThat(errorMessages).containsExactly("Corrupt YDK file header");
    }

    @Test
    @DisplayName("handleTokenRefreshException should return 403 ProblemDetail with message")
    void handleTokenRefreshException_shouldReturnForbiddenProblemDetail_whenTokenRefreshFails() {
        // Arrange
        TokenRefreshException exception = new TokenRefreshException("sample-token", "Token was revoked");

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleTokenRefreshException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.FORBIDDEN.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Token Refresh Failed");
        assertThat(problemDetail.getDetail()).contains("Token was revoked");
    }

    @Test
    @DisplayName("handleIllegalArgumentException should return 400 ProblemDetail with message")
    void handleIllegalArgumentException_shouldReturnBadRequestProblemDetail_whenIllegalArgumentThrown() {
        // Arrange
        IllegalArgumentException exception = new IllegalArgumentException("Invalid deck format parameter");

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleIllegalArgumentException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Invalid Argument");
        assertThat(problemDetail.getDetail()).isEqualTo("Invalid deck format parameter");
    }

    @Test
    @DisplayName("handleGeneralException should return 500 ProblemDetail with generic message")
    void handleGeneralException_shouldReturnInternalServerErrorProblemDetail_whenUnexpectedExceptionThrown() {
        // Arrange
        RuntimeException exception = new RuntimeException("Database connection timeout");

        // Act
        ProblemDetail problemDetail = exceptionHandler.handleGeneralException(exception);

        // Assert
        assertThat(problemDetail).isNotNull();
        assertThat(problemDetail.getStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
        assertThat(problemDetail.getTitle()).isEqualTo("Internal Server Error");
        assertThat(problemDetail.getDetail()).isEqualTo("An unexpected error occurred. Please try again later.");
    }
}
