package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class MessageResponseTest {
    @Test
    void testMessageResponse() {
        MessageResponse response = new MessageResponse("Test message");
        assertEquals("Test message", response.getMessage());

        response.setMessage("New message");
        assertEquals("New message", response.getMessage());
    }
}
