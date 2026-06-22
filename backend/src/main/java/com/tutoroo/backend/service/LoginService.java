package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.tutoroo.backend.dto.LoginDto;

public class LoginService {
    public ResponseEntity<?> login(LoginDto loginDto){
        System.out.print(loginDto);
        return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Invalid or corrupted token"));

    }
}
