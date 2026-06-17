package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.dto.SendTokenRequest;
import com.example.demo.dto.VeriOtpRequests;
import com.example.demo.service.AuthService;
import com.example.demo.dto.FacebookRequest;
import com.example.demo.dto.GoogleRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.service.oauth.FacebookOAuthService;
import com.example.demo.service.oauth.GoogleOAuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @CrossOrigin(origins = "http://127.0.0.1:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @Autowired
    private FacebookOAuthService facebookOAuthService;

    @PostMapping("/auth/send-token")
    public ResponseEntity<?> sendToken(@Valid @RequestBody SendTokenRequest request) {
        return authService.handleSendToken(request);
    }

    @PostMapping("/auth/veri-otp")
    public ResponseEntity<?> veriOtp(@Valid @RequestBody VeriOtpRequests requestBody, @RequestHeader("T-Auth") String Tauth){
        return authService.veriOtp(requestBody, Tauth);
    }

    @PostMapping("/auth/check-token")
    public ResponseEntity<?> checkToken(@RequestHeader("T-Auth") String Tauth){
        return authService.checkToken(Tauth);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response){
        return authService.login(request, response);
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<?> google(@Valid @RequestBody GoogleRequest request){
        return googleOAuthService.verifyToken(request);
    }

    @PostMapping("/oauth/facebook")
    public ResponseEntity<?> facebook(@Valid @RequestBody FacebookRequest request){
        return facebookOAuthService.verifyToken(request);
    }
}