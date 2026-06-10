package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.ThongTinTaiKhoan;

public interface ThongTinTaiKhoanRepository extends JpaRepository<ThongTinTaiKhoan, Long> {
}