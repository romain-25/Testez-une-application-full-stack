package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ExceptionTest {
    @Test
    void testBadRequestException() {
        BadRequestException exception = new BadRequestException();
        assertNotNull(exception);
    }

    @Test
    void testNotFoundException() {
        NotFoundException exception = new NotFoundException();
        assertNotNull(exception);
    }
}
