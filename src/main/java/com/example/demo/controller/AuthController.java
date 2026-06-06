package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.dto.SendTokenRequest;
import com.example.demo.service.AuthService;
import com.example.demo.dto.GoogleRequest;
import com.example.demo.service.oauth.GoogleOAuthService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private GoogleOAuthService googleOAuthService;


    @PostMapping("/register")
    public String register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String email
    ) {
        System.out.println("Email: "+ email);
        System.out.println("Username: " + username);
        System.out.println("Password: " + password);

        return "OK";
    }

    @PostMapping("/send-token")
    public ResponseEntity<?> sendToken(@Valid @RequestBody SendTokenRequest request) {
        return authService.handleSendToken(request);
    }

    @PostMapping("/check-token")
    public ResponseEntity<?> checkToken(@RequestHeader("Authorization") String Tauth){
        return authService.checkToken(Tauth);
    }

    @PostMapping("/google")
    public ResponseEntity<?> google(@Valid @RequestBody GoogleRequest request){
        return googleOAuthService.verifyToken(request);
    }
}