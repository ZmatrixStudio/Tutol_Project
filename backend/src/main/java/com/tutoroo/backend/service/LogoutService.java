package com.tutoroo.backend.service;

import java.time.Instant;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.entity.RefreshToken;
import com.tutoroo.backend.repository.RefreshTokenRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutService {
    private final RefreshTokenRepository refreshTokenRepository;

    public ResponseEntity<?> Logout(HttpServletRequest request){
        // CHECK COOKIE
        String deviceId = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) 
            for (Cookie cookie : cookies){
                if ("_DID".equals(cookie.getName())){
                    deviceId = cookie.getValue();
                }
            }
        else    
            return ResponseEntity.status(403).build();

        if (deviceId == null) return ResponseEntity.status(403).build();

        // CHECK DATABASE
        RefreshToken rt = refreshTokenRepository.findByDeviceId(deviceId).orElseThrow(() -> new RuntimeException("Refresh token not found"));
        rt.setRevoked(true);
        rt.setExpiryDate(Instant.now());
        refreshTokenRepository.save(rt);

        ResponseCookie rtCookie = ResponseCookie.from("_RT", "")
            .httpOnly(true)
            .secure(true)     
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();
        return ResponseEntity.noContent()
        .headers(headers -> {
            headers.add(HttpHeaders.SET_COOKIE, rtCookie.toString());
        })
        .build();
        
    }
}
