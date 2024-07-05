package com.openclassrooms.starterjwt;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
public class SignupRequestTest {
    private final Validator validator;

    public SignupRequestTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    void testValidSignupRequest() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("Test");
        request.setLastName("User");
        request.setPassword("password123");

        Set<javax.validation.ConstraintViolation<SignupRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());

    }
}
