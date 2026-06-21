package com.example.demo.repository;

import com.example.demo.entity.RefreshToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // 🔍 tìm theo token
    Optional<RefreshToken> findByToken(String token);

    // 🧹 xoá tất cả token của 1 user (logout all device)
    void deleteByUserId(Long userId);
}
