package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JwtResponseTest {
    @Test
    void testJwtResponse() {
        JwtResponse response = new JwtResponse("token123", 1L, "testuser", "Test", "User", true);

        assertEquals("token123", response.getToken());
        assertEquals("Bearer", response.getType());
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertTrue(response.getAdmin());

        response.setToken("newtoken");
        assertEquals("newtoken", response.getToken());

        response.setType("JWT");
        assertEquals("JWT", response.getType());
    }
}
