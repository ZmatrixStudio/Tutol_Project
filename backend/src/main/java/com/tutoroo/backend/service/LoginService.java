package com.tutoroo.backend.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final LocalAccountRepository localAccountRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> login(LoginDto loginDto){
        if (loginDto.getEmail() == null || loginDto.getEmail().isBlank()) {
            return ResponseEntity.status(400).body(Map.of(
                "status", "400",
                "success", false,
                "message", "Vui lòng nhập Email"
            ));
        }
        if (loginDto.getPassword() == null || loginDto.getPassword().isBlank()) {
            return ResponseEntity.status(400).body(Map.of(
                "status", "400",
                "success", false,
                "message", "Vui lòng nhập mật khẩu"
            ));
        }

        Optional<LocalAccount> localOpt = localAccountRepository.findByEmail(loginDto.getEmail());
        
        if (localOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "status", "401",
                "success", false,
                "message", "Email hoặc mật khẩu không chính xác!"
            ));
        }

        LocalAccount local = localOpt.get();

        if (!passwordEncoder.matches(loginDto.getPassword(), local.getMatKhau())){
            return ResponseEntity.status(401).body(Map.of(
                "status", "401",
                "success", false,
                "message", "Email hoặc mật khẩu không chính xác!"
            ));
        }

        taiKhoanRepository.updateLastLogin(local.getTaiKhoan().getMaTaiKhoan());
        
        return ResponseEntity.status(200).body(Map.of(
            "status", "200",
            "success", true,
            "message", "Đăng nhập thành công!",
            "data", Map.of(
                "maTaiKhoan", local.getMaTaiKhoan(),
                "email", local.getEmail()
            )
        ));

    }
}
