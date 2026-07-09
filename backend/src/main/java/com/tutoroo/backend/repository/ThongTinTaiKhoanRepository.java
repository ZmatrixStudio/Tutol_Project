package com.tutoroo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutoroo.backend.entity.ThongTinTaiKhoan;

@Repository
public interface ThongTinTaiKhoanRepository extends JpaRepository<ThongTinTaiKhoan, Long> {
    Optional<ThongTinTaiKhoan> findById(Long id);
} 