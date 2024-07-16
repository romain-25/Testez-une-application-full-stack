package com.openclassrooms.starterjwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @Value("${oc.app.jwtSecret:defaultSecret}")
    private String jwtSecret;

    @Value("${oc.app.jwtExpirationMs:3600000}")
    private int jwtExpirationMs;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();
        jwtUtils.jwtSecret = "mySecretKey"; // Provide a default non-empty secret key
        jwtUtils.jwtExpirationMs = 3600000; // Provide a default expiration time
    }

    @Test
    public void testGenerateJwtToken() {
        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userPrincipal = new UserDetailsImpl(1L, "username", "password", "email@example.com", true, "ROLE_USER");
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token);
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String username = "user";
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtUtils.jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtUtils.jwtSecret)
                .compact();

        String extractedUsername = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals(username, extractedUsername);
    }

    @Test
    public void testValidateJwtToken_Valid() {
        String token = Jwts.builder()
                .setSubject("user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtUtils.jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtUtils.jwtSecret)
                .compact();

        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_Invalid() {
        String token = "invalid-token";
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_Expired() {
        String token = Jwts.builder()
                .setSubject("user")
                .setIssuedAt(new Date(System.currentTimeMillis() - jwtUtils.jwtExpirationMs - 1000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(SignatureAlgorithm.HS512, jwtUtils.jwtSecret)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(token));
    }
}
