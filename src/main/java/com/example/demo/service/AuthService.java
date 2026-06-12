package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.OtpData;
import com.example.demo.dto.SendTokenRequest;
import com.example.demo.dto.VeriOtpRequests;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.util.JwtUtil;

import io.jsonwebtoken.Claims;

import com.example.demo.security.RecaptchaService;
import com.example.demo.store.OtpStore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TaiKhoanService taiKhoanService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> handleSendToken(SendTokenRequest request) {
        try{

            // CHECK DB XEM EMAIL ĐÃ TỒN TẠI CHƯA
            String email = request.getEmail();
            if (taiKhoanService.existsByEmail(email)) {
                return ResponseEntity.status(401).body(Map.of("status", 400, "msg", "Email đã tồn tại!!", "success", false, "errol", 2));
            }

            // CHECK RECAPTCHA
            String recaptchaToken = request.getRecaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }

            String username = request.getUsername();
            String password = request.getPassword();

            // Send email
            emailService.sendOtpEmail(email, username, password);

            // Generate JWT
            String jwt = JwtUtil.generateTAuth(email, username);

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
            Claims claims = JwtUtil.parseTAuth(token);

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

    public ResponseEntity<?> veriOtp(VeriOtpRequests requestBody, String authHeader){
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(
                        Map.of("valid", false, "msg", "Missing token")
                );
            }

            String token = authHeader.replace("Bearer ", "");

            // parse JWT (check signature + exp)
            Claims claims = JwtUtil.parseTAuth(token);

            String email = claims.getSubject();
            String username = claims.get("username", String.class);

            Date exp = claims.getExpiration();
            System.out.println(exp);
            long expiresIn = (exp.getTime() - System.currentTimeMillis()) / 1000;

            if (expiresIn <= 0) {
                return ResponseEntity.status(401).body(
                        Map.of("valid", false, "msg", "Token expired")
                );
            }

            OtpData otpData = OtpStore.otpMap.get(email);
            
            // KIỂM TRA EMAIL
            if (otpData == null){
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Otp không tồn tại !!", "success", false, "errol", 1));
            }

            // KIỂM TRA USERNAME
            if (!otpData.getUsername().trim().equals(username.trim())){
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Thống số không đúng !!", "success", false, "errol", 1));
            }

            // KIỂM TRA MÃ OTP
            if (!otpData.getOtp().equals(requestBody.getOtp())) {
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Xác thực OTP thất bại !!", "success", false, "errol", 1));
            }

            // LƯU USERNAME, PASSWORD, EMAIL, TIME, REFRESH VÀO DATABASE 
            String password = otpData.getPassword();
            taiKhoanService.createAccount(username, email, password);

            // TRẢ VỀ ACCESS TOKEN VÀ REFRESH TOKEN
            return ResponseEntity.ok(Map.of("status", 200,"msg", "Xác thực thành công !!",
                                        "data", Map.of(
                                            "accessToken", "",
                                            "refreshToken", ""
                                        ),"success", true,"error", 0));

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(401).body(
                    Map.of("valid", false, "msg", "Invalid token")
            );
        }
    }

    public ResponseEntity<?> login(LoginRequest request){
        try {
            String recaptchaToken = request.getReCaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }

            String email = request.getEmail();
            String password = request.getPassword();

            Optional<TaiKhoan> optionalTaiKhoan = taiKhoanService.findByEmailNotFacebook(email);

            if (optionalTaiKhoan.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Email không tồn tại, vui lòng đăng kí!!", "success", false, "errol", 1));
            }

            TaiKhoan taiKhoan = optionalTaiKhoan.get();

            // kiểm tra mật khẩu
            if (!passwordEncoder.matches(password, taiKhoan.getMatKhau())) {
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Sai mật khẩu !!", "success", false, "errol", 1));

            }

            // TRẢ VỀ ACCESS TOKEN VÀ REFRESH TOKEN
            return ResponseEntity.ok(Map.of("status", 200,"msg", "Xác thực thành công !!",
                                        "data", Map.of(
                                            "accessToken", "",
                                            "refreshToken", ""
                                        ),"success", true,"error", 0));
        } catch (Exception e) {
            System.out.println("[AuthService:login] -> "+e.getMessage());
            return ResponseEntity.status(500).body(Map.of("status", 500, "msg", "Server gặp lỗi, chờ vài phút và thử lại!!", "success", false, "errol", 1));
        }
    }
}
