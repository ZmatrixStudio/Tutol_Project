package com.tutoroo.backend.service;

import java.security.SecureRandom;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IdentifierService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private final RedisOtpService redisOtpService;

    private final SecureRandom random = new SecureRandom();

    public ResponseEntity<?> sendOtp(String email, String purpose){
        if (purpose.equalsIgnoreCase("REGISTER")) {
            // KIỂM TRA XEM EMAIL ĐÃ TẠO CHƯA NẾU CHƯA THÌ CHO ĐI TIẾP
        } else if(purpose.equalsIgnoreCase("FORGOT")) {
            // KIỂM TRA XEM EMAIL ĐÃ TẠO CHƯA NẾU RỒI THÌ CHO ĐI TIẾP
        } else {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "Not Found"));

        }
        String otp = String.format("%06d", random.nextInt(1000000));
        String otpToken = redisOtpService.createOtp(email, otp, purpose, 300);

        if (otpToken == "Vui lòng đợi 60 giây để gửi lại OTP"){
            return ResponseEntity.status(429).body(Map.of("status", 429, "error", true, "success", false, "message", otpToken));

        } 
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("Tutoroo - Email Verification Code");
        message.setTo(email);
        message.setText(
            "Hello,\n\n" +
            "Your verification code is: " + otp + "\n\n" +
            "This code is valid for a limited time.\n" +
            "If you did not request this code, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Tutoroo Team"
        );

        mailSender.send(message);
        
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status", 200, "error", false, "success", true, "message", "Mã OTP đã được gửi vào Email thành công !!", "otpToken", otpToken));
    }

    
}
