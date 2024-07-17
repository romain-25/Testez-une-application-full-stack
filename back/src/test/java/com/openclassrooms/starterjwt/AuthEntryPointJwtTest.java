package com.openclassrooms.starterjwt;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @Mock
    private ServletOutputStream outputStream;


    private ByteArrayOutputStream byteArrayOutputStream;

    @BeforeEach
    public void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        byteArrayOutputStream = new ByteArrayOutputStream();
        outputStream = new ServletOutputStream() {
            @Override
            public void write(int b) throws IOException {
                byteArrayOutputStream.write(b);
            }

            @Override
            public void write(byte[] b, int off, int len) throws IOException {
                byteArrayOutputStream.write(b, off, len);
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(WriteListener writeListener) {
                // no-op for test
            }
        };
        when(response.getOutputStream()).thenReturn(outputStream);
    }

    @Test
    public void testCommence() throws IOException, ServletException {
        when(authException.getMessage()).thenReturn("Unauthorized");
        when(request.getServletPath()).thenReturn("/login");

        authEntryPointJwt.commence(request, response, authException);

        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String actualResponse = byteArrayOutputStream.toString(StandardCharsets.UTF_8);
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        expectedResponse.put("error", "Unauthorized");
        expectedResponse.put("message", "Unauthorized");
        expectedResponse.put("path", "/login");

        ObjectMapper objectMapper = new ObjectMapper();
        String expectedJsonResponse = objectMapper.writeValueAsString(expectedResponse);

        // Print actual and expected JSON for debugging
        System.out.println("Actual JSON: " + actualResponse);
        System.out.println("Expected JSON: " + expectedJsonResponse);

        assertEquals(expectedJsonResponse, actualResponse.trim());
    }
}
