package com.tutoroo.backend.service;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.util.KeyGeneratorUtil;

import java.security.KeyPair;
import java.util.Date;

@Service
public class JwtService {

    private final KeyPair keyPair;

    public JwtService() throws Exception {
        this.keyPair = KeyGeneratorUtil.generateKeyPair();
    }

    // ACCESS TOKEN (15 phút)
    public String generateAccessToken(Long userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }

    // REFRESH TOKEN (7 ngày)
    public String generateRefreshToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000))
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }

    // VERIFY TOKEN
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(keyPair.getPublic())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long getUserId(String token) {
        return Long.parseLong(parseToken(token).getSubject());
    }

    public boolean isValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}