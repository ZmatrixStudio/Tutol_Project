package com.example.demo.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.TaiKhoan;
import com.example.demo.entity.ThongTinTaiKhoan;
import com.example.demo.repository.TaiKhoanRepository;

@Service
@Transactional
public class TaiKhoanService {

    private final TaiKhoanRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public TaiKhoanService(TaiKhoanRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TaiKhoan createAccount(
            String username,
            String email,
            String password) {

        if (accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại");
        }

        TaiKhoan acc = new TaiKhoan();
        acc.setEmail(email);
        acc.setMatKhau(passwordEncoder.encode(password));
        acc.setRole("USER");

        ThongTinTaiKhoan profile = new ThongTinTaiKhoan();
        profile.setUsername(username);

        // Thiết lập quan hệ 2 chiều
        profile.setTaiKhoan(acc);
        acc.setThongTinTaiKhoan(profile);

        return accountRepository.save(acc);
    }

    public Optional<TaiKhoan> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public Optional<TaiKhoan> findById(Long id) {
        return accountRepository.findById(id);
    }

    public boolean existsByEmail(String email) { 
        return accountRepository.existsByEmail(email);
    }
}