package com.tutoroo.backend.service;

import java.util.List;
import java.net.HttpCookie;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class LogoutService {
    public ResponseEntity<?> logout(HttpHeaders headers){
        String cookieHeader = headers.getFirst(HttpHeaders.COOKIE);
        HttpHeaders responseHeaders = new HttpHeaders();

        if (cookieHeader != null){
            List<HttpCookie> cookies = HttpCookie.parse(cookieHeader);
            for (HttpCookie cookie : cookies) {
                ResponseCookie deleteCookie = ResponseCookie.from(cookie.getName(), "")
                        .httpOnly(true)
                        .secure(true) // Bật true nếu production dùng HTTPS
                        .path("/")    // Đảm bảo khớp path để trình duyệt chịu xóa
                        .maxAge(0)    
                        .sameSite("Strict")
                        .build();
                
                // Thêm vào danh sách header trả về cho Client
                responseHeaders.add(HttpHeaders.SET_COOKIE, deleteCookie.toString());
            }
        } 

        // CHUYỂN ĐỔI TRANG THÁI Ở DATABASE

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .body("Đăng xuất thành công!");

    }
}
