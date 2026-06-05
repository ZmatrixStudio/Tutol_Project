package com.example.demo.service;
import com.example.demo.dto.SendTokenRequest;
import com.example.demo.util.JwtUtil;
import com.example.demo.security.RateLimitService;
import com.example.demo.security.RecaptchaService;
import com.example.demo.security.TokenSecurityService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private RateLimitService rateLimitService;

    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private TokenSecurityService tokenSecurityService;

    public ResponseEntity<?> handleSendToken(SendTokenRequest request,String xToken,HttpServletRequest httpRequest) {
        try{
            String ip = httpRequest.getHeader("X-Forwarded-For");
            if (ip ==  null || ip.isEmpty()){
                ip = httpRequest.getRemoteAddr(); // Get ip
            }

            String[] data = tokenSecurityService.checkXToken(xToken);

            String key = ip +""+data[0];
            if (!rateLimitService.allow(key)){
                return ResponseEntity.status(429).body(Map.of("status", "429", "msg", "Too many requests !", "countdown", 10));
            }
            String recaptchaToken = request.getRecaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }

            String email = request.getEmail();
            String username = request.getUsername();
            String password = request.getPassword();

            System.out.printf("[%s] %s => EMAIL=%s USERNAME=%s%n",
                    httpRequest.getMethod(),
                    httpRequest.getRequestURI(),
                    email,
                    username);

            // 7. generate JWT
            String jwt = JwtUtil.generateToken(email, username);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "msg", "Lấy Token Cache Thành Công !!",
                            "t-token", jwt,
                            "reCAPTCHA", true
                    )
            );
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("error: " + e.getMessage());
        }
    }
}
