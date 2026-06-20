package com.deck.lab.backend.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DeckDtoValidator.class)
@Documented
public @interface ValidDeck {
    String message() default "Invalid deck composition";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
