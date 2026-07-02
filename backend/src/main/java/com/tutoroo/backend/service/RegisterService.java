package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.RegisterDto;

import lombok.Data;

@Data
@Service
public class RegisterService {
    @Autowired
    private final RedisOtpService redisOtpService;

    public ResponseEntity<?> Register(RegisterDto dto){
        boolean checkOtp = redisOtpService.verifyOtp(dto.getEmail(), dto.getOtp(), "REGISTER", dto.getState());
        if (!checkOtp){
            return ResponseEntity.status(400).body(Map.of("status", 400, "error", true, "success", false, "message", "OTP không hợp lệ hoặc đã hết hạn"));
        }
        // LƯU VÀO DATABASER
        return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công !"));
    }
}
