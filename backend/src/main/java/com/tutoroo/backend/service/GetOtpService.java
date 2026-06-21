package com.tutoroo.backend.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.GetOtpDto;
import com.tutoroo.backend.model.TempOtpData;
import com.tutoroo.backend.store.TempOtpStore;
import com.tutoroo.backend.util.AESUtil;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetOtpService {

    private final JavaMailSender mailSender;

    public ResponseEntity<?> sendOtpEmail(GetOtpDto getOtpDto) {

        try {

            String otp = String.valueOf(
                    ThreadLocalRandom.current().nextInt(100000, 999999));

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(getOtpDto.getEmail());
            helper.setSubject("🔐 Verify Your Email - Tutol");

            String html = """
                    <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px">
                        <div style="
                            max-width:600px;
                            margin:auto;
                            background:white;
                            border-radius:16px;
                            overflow:hidden;
                            box-shadow:0 4px 20px rgba(0,0,0,.1);">

                            <div style="
                                background:#2563eb;
                                padding:25px;
                                text-align:center;">
                                <h1 style="color:white;margin:0;">
                                    TUTOL
                                </h1>
                            </div>

                            <div style="padding:40px;text-align:center;">

                                <h2>Hello %s 👋</h2>

                                <p style="color:#666;">
                                    Thank you for registering.
                                    Please use the verification code below.
                                </p>

                                <div style="
                                    display:inline-block;
                                    padding:18px 35px;
                                    margin:20px 0;
                                    border-radius:12px;
                                    background:#eff6ff;
                                    color:#2563eb;
                                    font-size:34px;
                                    font-weight:bold;
                                    letter-spacing:8px;">
                                    %s
                                </div>

                                <p style="color:#888;">
                                    This OTP will expire in 5 minutes.
                                </p>

                            </div>

                            <div style="
                                background:#f8fafc;
                                text-align:center;
                                padding:20px;
                                color:#999;
                                font-size:12px;">
                                © 2026 Tutol. All rights reserved.
                            </div>

                        </div>
                    </div>
                    """
                    .formatted(getOtpDto.getFirstName()+ " " + getOtpDto.getLastName(), otp);

            helper.setText(html, true);

            mailSender.send(message);
            
            String payload = getOtpDto.getFirstName() + getOtpDto.getLastName() + getOtpDto.getEmail() + getOtpDto.getType();
            String t_token = AESUtil.encrypt(payload);

            TempOtpStore.save(
                    getOtpDto.getEmail(),
                    new TempOtpData(
                            getOtpDto.getFirstName(),
                            getOtpDto.getLastName(),
                            getOtpDto.getEmail(),
                            getOtpDto.getPassword(),
                            getOtpDto.getType(),
                            otp,
                            LocalDateTime.now().plusMinutes(5)));
                            
            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "msg", "Lấy Token Cache Thành Công !!",
                            "t_token", t_token,
                            "time_token", "",
                            "reCAPTCHA", false
                    )
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("error: " + e.getMessage());
        }
    }
}