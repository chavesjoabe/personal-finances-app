package com.family.finances.core.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        jwtTokenProvider.jwtSecret = "test-super-secret-jwt-key-2026-very-secure-256-bits";
        jwtTokenProvider.expirationHours = 24;
    }

    @Test
    void shouldGenerateAndValidateToken() {
        String token = jwtTokenProvider.generateToken("user-123", "joabe@test.com", "Joabe");

        assertNotNull(token);
        Claims claims = jwtTokenProvider.validateAndExtractClaims(token);
        assertNotNull(claims);
        assertEquals("user-123", claims.getSubject());
        assertEquals("joabe@test.com", claims.get("email"));
        assertEquals("Joabe", claims.get("name"));
    }

    @Test
    void shouldReturnNullForTamperedToken() {
        String token = jwtTokenProvider.generateToken("user-123", "joabe@test.com", "Joabe");
        String tamperedToken = token + "invalid";

        Claims claims = jwtTokenProvider.validateAndExtractClaims(tamperedToken);
        assertNull(claims);
    }
}