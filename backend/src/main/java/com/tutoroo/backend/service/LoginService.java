package com.tutoroo.backend.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;

import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.entity.RefreshToken;
import com.tutoroo.backend.entity.TaiKhoan;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.repository.RefreshTokenRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;
import com.tutoroo.backend.util.NX1Crypto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final LocalAccountRepository localAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    public ResponseEntity<?> Login(LoginDto dto) throws Exception {
        String email = dto.getEmail();
        String password = dto.getPassword();

        LocalAccount localUser  = localAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email không tồn tại"));
        if(!passwordEncoder.matches(password, localUser .getPassword())) {
            return ResponseEntity.status(401).body(Map.of("status", 401, "error", true, "success", false, "message", "Mật khẩu tài khoản không hợp lệ !"));
        }

        TaiKhoan taiKhoan = localUser.getTaiKhoan();
        taiKhoan.setLastLoginAt(Instant.now());
        taiKhoanRepository.save(taiKhoan);
        
        // Lưu vào database
        String deviceId = NX1Crypto.encrypt(UUID.randomUUID().toString());
        String refreshTokenHash = passwordEncoder.encode(taiKhoan.getId() + "|NX1DEBUGSESSION");

        String accessToken = jwtService.generateAccessToken(taiKhoan.getId(), email, taiKhoan.getRole(), "LoginAuth", deviceId);

        // LƯU VÀO BẢNG REFRESH TOKEN
        RefreshToken refreshToken = refreshTokenRepository.findByIdAndDeviceId(taiKhoan.getId(), deviceId).orElse(null);
        if (refreshToken == null ){
            refreshToken = new RefreshToken();
            refreshToken.setTaiKhoan(taiKhoan);
            refreshToken.setDeviceId(deviceId);
            refreshToken.setTokenHash(refreshTokenHash);
            refreshToken.setRevoked(false);
            refreshToken.setExpiryDate(Instant.now().plus(Duration.ofDays(7)));
        } else {
            refreshToken.setTokenHash(refreshTokenHash);
            refreshToken.setExpiryDate(Instant.now().plus(Duration.ofDays(7)));
            refreshToken.setRevoked(false);
        }

        refreshTokenRepository.save(refreshToken);
        
        ResponseCookie refreshCookie = ResponseCookie
            .from("_RT", refreshTokenHash)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60L * 60 * 24 * 7) // 7 ngày
            .sameSite("Lax")
            .build();

        ResponseCookie deviceCookie = ResponseCookie
            .from("_DID", deviceId)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60L * 60 * 24 * 365) // 1 năm
            .sameSite("Lax")
            .build();
        
        return ResponseEntity.ok()
        .headers(headers -> {
            headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, deviceCookie.toString());
        })
        .body(Map.of(
                "status", 200,
                "error", false,
                "success", true,
                "message", "Xác thực tài khoản thành công !",
                "accessToken", accessToken
        ));
    }
}
