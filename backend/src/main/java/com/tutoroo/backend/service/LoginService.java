package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.LoginDto;

@Service
public class LoginService {
    public ResponseEntity<?> Login(LoginDto dto){
        String email = dto.getEmail();
        String password = dto.getPassword();
        return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công !"));

    }
}
