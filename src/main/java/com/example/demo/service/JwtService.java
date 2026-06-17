package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import org.hashids.Hashids;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET = "_QRTKpb31sEdbOA5nyh6IdIGs9vLs3HcLmioYQ2gl9md9UWM8w8QKnBRozRPF43NUSn9xCu30oXjCLVlvhGovg";

    private static final long ACCESS_TOKEN_EXP_MS = 15 * 60 * 1000;

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateAccessToken(Long userId, String apiLink) {
        Instant now = Instant.now();
        Hashids hashids = new Hashids("secret-salt", 10);
        
        String hashId = hashids.encode(userId);
        return Jwts.builder()
                .setIssuer(apiLink)
                .setSubject(hashId)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(ACCESS_TOKEN_EXP_MS)))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        return Long.valueOf(
                extractClaims(token).getSubject()
        );
    }

    public String extractJti(String token) {
        return extractClaims(token).getId();
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}