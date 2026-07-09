package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.tutoroo.backend.dto.ForgotDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.util.NX1Crypto;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ForgotService {

    private final LocalAccountRepository localAccountRepository;

    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> Forgot(ForgotDto dto){
        // kIỂM TRA XEM TOKEN CÓ PHẢI DO SERVER TẠO RA KHÔNG 
        try {
            String nx1Token = NX1Crypto.decrypt(dto.getNX1DEBUG());
            String[] parts = nx1Token.split("\\|");
        
            if (parts.length != 2) {
                return ResponseEntity.badRequest().body("Token invalid");
            }

            // TOKEN CHỈ SỐNG 10P
            if ((Long.parseLong(parts[1]) - System.currentTimeMillis()) > 10 * 60 * 1000) {
                return ResponseEntity.badRequest().body("Token expired");
            }

            // KIỂM TRA EMAIL TRONG TOKEN ĐÓ TRÙNG VỚI EMAIL THÌ ĐI TIẾP
            if (!parts[0].equals(dto.getEmail())) { 
                return ResponseEntity.badRequest().body("Email mismatch token");
            }

            // HAST PASS CHO VÀO DATABASE
            String hastPass = passwordEncoder.encode(dto.getPassword());
            LocalAccount localAccount = localAccountRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
            localAccount.setPassword(hastPass);
            localAccountRepository.save(localAccount);

            // ĐÁ RA LOGIN     
            return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công !"));
                                                                            
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        
    }
}
