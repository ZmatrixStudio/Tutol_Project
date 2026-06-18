package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.List;

import javax.crypto.SecretKey;


import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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

    private final Hashids hashids = new Hashids("=Y9#P!vQ2kL8@eN5m", 10);

    public String generateAccessToken(Long userId, String apiLink) {
        Instant now = Instant.now();
        Hashids hashids = new Hashids("=Y9#P!vQ2kL8@eN5m", 10);
        
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

    public Long extractUserId(String token ) {

        String hashId = extractClaims(token).getSubject();

        long[] ids = hashids.decode(hashId);

        if (ids.length == 0) {
            throw new RuntimeException("Invalid token");
        }

        return ids[0];
    }

    public Authentication buildAuthentication(String token) {

        Long userId = extractUserId(token);

        return new UsernamePasswordAuthenticationToken(
                userId,
                null,
                List.of(
                    new SimpleGrantedAuthority(
                        "ROLE_USER"
                    )
                )
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