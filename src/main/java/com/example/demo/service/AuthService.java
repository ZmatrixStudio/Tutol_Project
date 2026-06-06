package com.example.demo.service;

import com.example.demo.dto.SendTokenRequest;
import com.example.demo.util.JwtUtil;

import io.jsonwebtoken.Claims;

import com.example.demo.security.RecaptchaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Date;

@Service
public class AuthService {
    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private EmailService emailService;

    public ResponseEntity<?> handleSendToken(SendTokenRequest request) {
        try{
            String recaptchaToken = request.getRecaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }

            String email = request.getEmail();
            String username = request.getUsername();
            String password = request.getPassword();

            // 7. generate JWT
            String jwt = JwtUtil.generateToken(email, username);

            // Send email
            emailService.sendOtpEmail(email, username, password);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "msg", "Lấy Token Cache Thành Công !!",
                            "t_token", jwt,
                            "time_token", 60,
                            "reCAPTCHA", true
                    )
            );
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("error: " + e.getMessage());
        }
    }

    public ResponseEntity<?> checkToken(String authHeader) {

        try {

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(
                        Map.of("valid", false, "msg", "Missing token")
                );
            }

            String token = authHeader.replace("Bearer ", "");

            // parse JWT (check signature + exp)
            Claims claims = JwtUtil.parseToken(token);

            String email = claims.getSubject();
            String username = claims.get("username", String.class);

            Date exp = claims.getExpiration();
            long expiresIn = (exp.getTime() - System.currentTimeMillis()) / 1000;

            if (expiresIn <= 0) {
                return ResponseEntity.status(401).body(
                        Map.of("valid", false, "msg", "Token expired")
                );
            }

            return ResponseEntity.ok(
                    Map.of(
                            "valid", true,
                            "email", email,
                            "username", username,
                            "expiresIn", expiresIn
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    Map.of("valid", false, "msg", "Invalid token")
            );
        }
    }
}
