package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "thong_tin_tai_khoan")
public class ThongTinTaiKhoan {

    @Id
    @Column(name = "ma_tai_khoan")
    private Long maTaiKhoan;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(name = "ten")
    private String username;

    @Column(name = "so_dien_thoai")
    private String sdt;

    @Column(name = "dia_chi_chi_tiet")
    private String diaChi;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "ma_quan_huyen")
    private String maQuanHuyen;

    public ThongTinTaiKhoan() {
    }

    public ThongTinTaiKhoan(
            TaiKhoan taiKhoan,
            String username,
            String sdt,
            String diaChi,
            String avatar,
            String cccd,
            String maQuanHuyen) {

        this.taiKhoan = taiKhoan;
        this.username = username;
        this.sdt = sdt;
        this.diaChi = diaChi;
        this.avatar = avatar;
        this.cccd = cccd;
        this.maQuanHuyen = maQuanHuyen;
    }

    // ===== GETTERS =====

    public Long getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public String getUsername() {
        return username;
    }

    public String getSdt() {
        return sdt;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getCccd() {
        return cccd;
    }

    public String getMaQuanHuyen() {
        return maQuanHuyen;
    }

    // ===== SETTERS =====

    public void setMaTaiKhoan(Long maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }

    public void setMaQuanHuyen(String maQuanHuyen) {
        this.maQuanHuyen = maQuanHuyen;
    }
}