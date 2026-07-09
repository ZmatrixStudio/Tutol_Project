package com.tutoroo.backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tutoroo.backend.dto.RegisterDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.entity.TaiKhoan;
import com.tutoroo.backend.entity.ThongTinTaiKhoan;
import com.tutoroo.backend.enums.Role;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;
import com.tutoroo.backend.repository.ThongTinTaiKhoanRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Service
@RequiredArgsConstructor
public class RegisterService {
    @Autowired
    private final RedisOtpService redisOtpService;

    private final TaiKhoanRepository taiKhoanRepository;
    private final LocalAccountRepository localAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final ThongTinTaiKhoanRepository thongTinTaiKhoanRepository;

    public ResponseEntity<?> Register(RegisterDto dto){
        boolean checkOtp = redisOtpService.verifyOtp(dto.getEmail(), dto.getOtp(), "REGISTER", dto.getState());
        if (!checkOtp){
            return ResponseEntity.status(400).body(Map.of("status", 400, "error", true, "success", false, "message", "OTP không hợp lệ hoặc đã hết hạn"));
        }
        // LƯU VÀO BẢNG TAIKHOAN
        TaiKhoan user = taiKhoanRepository.save(TaiKhoan.builder().role(Role.USER).build());

        // LƯU VÀO BẢNG LOCALACCOUNT 
        localAccountRepository.save(LocalAccount.builder().taiKhoan(user).email(dto.getEmail()).password(passwordEncoder.encode(dto.getPassword())).build());

        // LƯU VÀO BẢNG THÔNG TIN 
        thongTinTaiKhoanRepository.save(ThongTinTaiKhoan.builder().taiKhoan(user).username(dto.getUsername()).build());

        return ResponseEntity.status(200).body(Map.of("status", 200, "error", false, "success", true, "message", "Xác thực tài khoản thành công vui lòng quay lại đnăg nhập !"));
    }
}
