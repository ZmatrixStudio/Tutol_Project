package com.tutoroo.backend.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.tutoroo.backend.enums.Role;
import com.tutoroo.backend.util.NX1Crypto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private static final String SECRET_KEY = "z5mQXxkWxnMo7hBZxZbBbKc5vM5zBGKEw0aZxtFiDideGkP9Zy8oPqb-CUHhIV2Dcb1Hm-wrzghffcjT9POnJQ";
    private final SecretKey KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    private static final long TIME_ACCESS = 1000 * 60 * 15;

    public String generateAccessToken(Long userId, String email, Role role, String api, String deviceId) {
        Date now = new Date();

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setIssuer(api)
                .setSubject(String.valueOf(userId))
                .setId(deviceId)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(now)
                .setNotBefore(now)
                .setExpiration(new Date(now.getTime() + TIME_ACCESS))
                .signWith(KEY)
                .compact();
}

    public Claims extractClaims (String accessToken) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
    }

    public boolean checkAccessToken (String token ) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("[JwtService:checkAccessToken] => Error: " + e.getMessage());
            return false;
        }
    }

    public String generateRefreshToken (Long userId, String deviceId, String email) {
        try {
            String nx1Token = NX1Crypto.encrypt(userId + "|" +deviceId + "|"+email);

            // LƯU VÀO DATABASE 
            return nx1Token;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }     
    }
}
