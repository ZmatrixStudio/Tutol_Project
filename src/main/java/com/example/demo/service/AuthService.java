package com.example.demo.service;

import com.example.demo.dto.SendTokenRequest;
import com.example.demo.util.JwtUtil;
import com.example.demo.security.RecaptchaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

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
            //String password = request.getPassword();

            // 7. generate JWT
            String jwt = JwtUtil.generateToken(email, username);

            // Send email
            emailService.sendOtpEmail(email);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "msg", "Lấy Token Cache Thành Công !!",
                            "t-token", jwt,
                            "time_token", 120,
                            "reCAPTCHA", true
                    )
            );
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("error: " + e.getMessage());
        }
    }
}
