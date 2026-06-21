package com.tutoroo.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tutoroo.backend.dto.GetOtpDto;
import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.service.GetOtpService;

@RestController
@RequestMapping("/api/v1")
public class ApiController {
    
    @Autowired
    private GetOtpService getOtpService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return ResponseEntity.ok("Đăng nhập thành công với email: " + loginDto.getEmail());
    }

    @PostMapping("/get-otp")
    public ResponseEntity<?> getOtp(@RequestBody GetOtpDto getOtpDto){
        return getOtpService.sendOtpEmail(getOtpDto);

    }
}
