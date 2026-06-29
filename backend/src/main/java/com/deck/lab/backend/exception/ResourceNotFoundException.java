package com.deck.lab.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Runtime exception thrown when a requested database resource (such as a card
 * or user) cannot be found.
 *
 * <p>
 * <b>ResponseStatus Annotation:</b>
 * The {@link ResponseStatus} annotation tells Spring Boot to automatically map
 * this exception to the specified HTTP Status code (in this case,
 * {@code 404 NOT FOUND}) whenever it escapes a REST Controller method. This
 * avoids having to write try-catch blocks manually in every endpoint method.
 * </p>
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
