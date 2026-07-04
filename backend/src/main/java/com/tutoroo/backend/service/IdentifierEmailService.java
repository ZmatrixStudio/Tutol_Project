package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.IdentifierEmailDto;
import com.tutoroo.backend.util.NX1Crypto;

import lombok.Data;

@Data
@Service
public class IdentifierEmailService {
    @Autowired
    private final RedisOtpService redisOtpService;

    public ResponseEntity<?> verifyOtp(IdentifierEmailDto dto) {
        boolean checkOtp = redisOtpService.verifyOtp(dto.getEmail(), dto.getOtp(), dto.getPurpose(), dto.getState());
        if (!checkOtp){
            return ResponseEntity.status(400).body(Map.of("status", 400, "error", true, "success", false, "message", "OTP không hợp lệ hoặc đã hết hạn"));
        }
        // TẠO TOKEN ĐỂ XÁC MÌNH ĐỂ TRÁNH VIỆC BẮT REQUESTS
        try {
            String nx1Token = NX1Crypto.encrypt(
                dto.getEmail() + "|" + System.currentTimeMillis()
            );
            return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công !", "NX1", nx1Token));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
