package com.tutoroo.backend.service;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.entity.TaiKhoan;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final LocalAccountRepository localAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> Login(LoginDto dto){
        String email = dto.getEmail();
        String password = dto.getPassword();

        LocalAccount localUser  = localAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email không tồn tại"));
        if(!passwordEncoder.matches(password, localUser .getPassword())) {
            return ResponseEntity.status(401).body(Map.of("status", 401, "error", true, "success", false, "message", "Mật khẩu tài khoản không hợp lệ !"));
        }

       TaiKhoan taiKhoan = localUser.getTaiKhoan();
        taiKhoan.setLastLoginAt(Instant.now());
        taiKhoanRepository.save(taiKhoan);

        return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công !", "accessToken", "JWT"));

    }
}
