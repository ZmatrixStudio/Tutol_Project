package com.tutoroo.backend.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tutoroo.backend.dto.GetOtpDto;
import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.dto.VeriOtpDto;
import com.tutoroo.backend.service.GetOtpService;
import com.tutoroo.backend.service.LoginService;
import com.tutoroo.backend.service.LogoutService;
import com.tutoroo.backend.service.VeriOtpService;

@RestController
@RequestMapping("/api/v1")
public class ApiController {
    
    @Autowired
    private GetOtpService getOtpService;

    @Autowired
    private VeriOtpService veriOtpService;

    @Autowired
    private LoginService loginService;

    @Autowired
    private LogoutService logoutService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return loginService.login(loginDto);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@RequestHeader HttpHeaders headers){
        return logoutService.logout(headers);
    }

    @PostMapping("/get-otp")
    public ResponseEntity<?> getOtp(@RequestBody GetOtpDto getOtpDto){
        return getOtpService.sendOtpEmail(getOtpDto);
    }

    @PostMapping("/veri-otp")
    public ResponseEntity<?> veriOtp(@RequestBody VeriOtpDto veriOtpDto, @RequestHeader HttpHeaders headers){
        return veriOtpService.checkOtp(veriOtpDto, headers);
    }

}
