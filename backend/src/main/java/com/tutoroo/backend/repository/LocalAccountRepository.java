package com.tutoroo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tutoroo.backend.entity.LocalAccount;

public interface LocalAccountRepository extends JpaRepository <LocalAccount, Long> {
    // Tìm tài khoản theo email
    Optional <LocalAccount> findByEmail(String email);
    // Kiểm tra email có tồn tại chưa
    boolean existsByEmail(String email);
    // Kiểm tra email có tồn tại chưa trừ ID hiện tại
    boolean existsByEmailAndMaTaiKhoanNot(String email, Long maTaiKhoan);
    

}
