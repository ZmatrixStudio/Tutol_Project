package com.example.demo.entity;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_tai_khoan")
    private Long maTaiKhoan;

    @OneToOne(
        mappedBy = "taiKhoan",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private ThongTinTaiKhoan thongTinTaiKhoan;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "role")
    private String role;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public TaiKhoan() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }

        if (role == null) {
            role = "USER";
        }
    }

    // ===== GETTERS =====

    public Long getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public ThongTinTaiKhoan getThongTinTaiKhoan() {
        return thongTinTaiKhoan;
    }

    public String getEmail() {
        return email;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public String getRole() {
        return role;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // ===== SETTERS =====

    public void setMaTaiKhoan(Long maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public void setThongTinTaiKhoan(ThongTinTaiKhoan thongTinTaiKhoan) {
        this.thongTinTaiKhoan = thongTinTaiKhoan;

        if (thongTinTaiKhoan != null) {
            thongTinTaiKhoan.setTaiKhoan(this);
        }
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}