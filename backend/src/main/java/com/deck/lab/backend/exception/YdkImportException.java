package com.deck.lab.backend.exception;

/**
 * Custom runtime exception thrown when a .ydk file import or parsing operation fails.
 */
public class YdkImportException extends RuntimeException {

    public YdkImportException(String message) {
        super(message);
    }

    public YdkImportException(String message, Throwable cause) {
        super(message, cause);
    }
}
