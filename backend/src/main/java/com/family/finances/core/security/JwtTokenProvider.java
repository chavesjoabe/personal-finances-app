package com.family.finances.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@ApplicationScoped
public class JwtTokenProvider {

    @ConfigProperty(name = "jwt.secret", defaultValue = "personal-finances-super-secret-jwt-key-2026-very-secure-256-bits-minimum")
    String jwtSecret;

    @ConfigProperty(name = "jwt.expiration-hours", defaultValue = "24")
    long expirationHours;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String email, String name) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (expirationHours * 3600 * 1000));

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("name", name)
                .issuer("personal-finances-api")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validateAndExtractClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public String getUserIdFromToken(String token) {
        Claims claims = validateAndExtractClaims(token);
        return claims != null ? claims.getSubject() : null;
    }
}