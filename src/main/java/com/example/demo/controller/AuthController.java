package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import com.example.demo.dto.SendTokenRequest;
import com.example.demo.service.AuthService;
import com.example.demo.dto.GoogleRequest;
import com.example.demo.service.oauth.GoogleOAuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:3000")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

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
    public ResponseEntity<?> sendToken(
        @Valid @RequestBody SendTokenRequest request,
        @RequestHeader HttpHeaders headers,
        HttpServletRequest httpRequest
    ) {
        
        String xToken = headers.getFirst("X-Token");

        return authService.handleSendToken(request, xToken, httpRequest);
    }

    @PostMapping("/google")
    public String google(@Valid @RequestBody GoogleRequest request, @RequestHeader HttpHeaders headers){
        String auth = request.getAuth();
        String recaptchaToken = request.getRecaptchaToken();
        String xToken = headers.getFirst("X-Token");
        GoogleOAuthService.verifyToken(auth);

        return "ok";
    }
}