package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.TaiKhoan;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {

    Optional<TaiKhoan> findByEmail(String email);

    @Query("""
        SELECT t
        FROM TaiKhoan t
        JOIN OAuth2 o ON o.taiKhoan.maTaiKhoan = t.maTaiKhoan
        WHERE t.email = :email
          AND o.provider = :provider
    """)
    Optional<TaiKhoan> findByEmailAndProvider(
        @Param("email") String email,
        @Param("provider") String provider
    );

    boolean existsByEmail(String email);
}