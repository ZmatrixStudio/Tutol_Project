package com.tutoroo.backend.service;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.enums.Role;
import com.tutoroo.backend.repository.RefreshTokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.Cookie;

@Service
@RequiredArgsConstructor
public class SessionRenewService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public ResponseEntity<?> getSessionNew(HttpServletRequest headers){
        Cookie[] cookies = headers.getCookies();
        String deviceId = null;
        String refreshToken= null;
        if (cookies != null){
            for (Cookie cookie : cookies){
                if ("_RT".equals(cookie.getName())){
                    refreshToken = cookie.getValue();
                } 
                if ("_DID".equals(cookie.getName())){
                    deviceId = cookie.getValue();
                }
            }
        } else {
            return ResponseEntity.status(403).body(Map.of());
        }

        if (refreshToken == null || deviceId == null)  return ResponseEntity.status(403).body(Map.of("msgError", "Vui lòng đăng nhập lại!"));
        
        // CHECK DATABASE
        Optional<Object[]> result = refreshTokenRepository.findValidUserInfoByRefreshToken(deviceId, refreshToken);

        if (result.isPresent()) {
            Object[] data = (Object[]) result.get()[0];
            System.out.println(Arrays.deepToString(data));
            String email = (String) data[0];
            Long maTaiKhoan = (Long) data[1];
            Role role = (Role) data[2];
            Boolean isBanned = (Boolean) data [3];
            if (isBanned) return ResponseEntity.status(403).body(Map.of("errorMsg", "Error The Band By Admin - Spam ?"));
            String accessTokenNew = jwtService.generateAccessToken(maTaiKhoan, email, role, "SessionNew", deviceId);
            return ResponseEntity.status(200).body(Map.of("accessToken", accessTokenNew));
        } else {
            return ResponseEntity.status(403).body(Map.of("errorMsg", "Vui lòng đăng nhập lại !"));
        }
        

    }
}
