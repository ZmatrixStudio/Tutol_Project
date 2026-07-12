package com.tutoroo.backend.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpHeaders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutoroo.backend.dto.OauthDto;
import com.tutoroo.backend.entity.Oauth2Account;
import com.tutoroo.backend.entity.RefreshToken;
import com.tutoroo.backend.entity.TaiKhoan;
import com.tutoroo.backend.entity.ThongTinTaiKhoan;
import com.tutoroo.backend.enums.Role;
import com.tutoroo.backend.repository.OauthRepostitory;
import com.tutoroo.backend.repository.RefreshTokenRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;
import com.tutoroo.backend.repository.ThongTinTaiKhoanRepository;
import com.tutoroo.backend.util.NX1Crypto;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OauthService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final OauthRepostitory oauthRepostitory;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ThongTinTaiKhoanRepository thongTinTaiKhoanRepository;

    public ResponseEntity<?> Google(OauthDto Dto, HttpServletRequest request) throws Exception{
        try {
            String tokenGoogle = Dto.getToken();
            URL url = URI.create("https://www.googleapis.com/oauth2/v3/userinfo").toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("Authorization", "Bearer " + tokenGoogle);
            
            int status = connection.getResponseCode();
            if (status != 200) {
                return ResponseEntity.status(401).body(Map.of("status", 401, "message", "Đăng nhập Oauth thất bại"));
            } 

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonResponse = mapper.readTree(connection.getInputStream());

            String email = jsonResponse.get("email").asText();
            String username = jsonResponse.get("name").asText();
            String providerUserId = jsonResponse.get("sub").asText();

            // KIỂM TRA XEM CÓ DEVICEID Ở COOKIE CHƯA
            String deviceId = null;

            Cookie[] cookies = request.getCookies();
            System.out.print(cookies);
            if (cookies != null){
                for (Cookie cookie : cookies){
                    if ("_DID".equals(cookie.getName())){
                        deviceId = cookie.getValue();
                    }
                }
            }

            if (deviceId == null) deviceId = NX1Crypto.encrypt(UUID.randomUUID().toString());

            // KIỂM TRA BẢNG OAUTH ACCOUNT
            TaiKhoan taiKhoan;
            Oauth2Account oauth2Account = oauthRepostitory.findByProviderUserId(providerUserId).orElse(null);
            if (oauth2Account == null) {
                taiKhoan = taiKhoanRepository.save(TaiKhoan.builder().role(Role.USER).build());
                oauth2Account = oauthRepostitory.save(Oauth2Account.builder().taiKhoan(taiKhoan).provider("GOOGLE").providerUserId(providerUserId).createdAt(Instant.now()).email(email).build());
                thongTinTaiKhoanRepository.save(ThongTinTaiKhoan.builder().taiKhoan(taiKhoan).username(username).build());  
            } else {
                taiKhoan = oauth2Account.getTaiKhoan();
                taiKhoan.setLastLoginAt(Instant.now());
                taiKhoanRepository.save(taiKhoan);
            }

            Long maTk = taiKhoan.getId();

            String refreshTokenHash = passwordEncoder.encode(maTk + "|NX1DEBUGSESSION");
            RefreshToken refreshToken = refreshTokenRepository.findByDeviceId(deviceId).orElse(null);
            if (refreshToken != null && refreshToken.getIsBanned()) return ResponseEntity.status(403).body(Map.of("errorMsg", "Error The Band By Admin - Spam ?"));
            
            if (refreshToken == null ){
                refreshToken = new RefreshToken();
                refreshToken.setTaiKhoan(taiKhoan);
                refreshToken.setDeviceId(deviceId);
                refreshToken.setTokenHash(refreshTokenHash);
                refreshToken.setRevoked(false);
                refreshToken.setExpiryDate(Instant.now().plus(Duration.ofDays(7)));
            } else {
                refreshToken.setTokenHash(refreshTokenHash);
                refreshToken.setTaiKhoan(taiKhoan);
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
                    "message", "Xác thực tài khoản thành công !"
            ));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                Map.of(
                    "status", 500,
                    "message", "Lỗi máy chủ"
                )
            );
        }

    }
}
