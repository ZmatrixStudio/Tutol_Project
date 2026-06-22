package com.tutoroo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "thong_tin_tai_khoan")
@Getter
@Setter
@NoArgsConstructor
public class Profile extends BaseEntity {

    @Id
    private Long maTaiKhoan;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    private String ten;

    @Column(unique = true)
    private String soDienThoai;

    private String diaChiChiTiet;

    private String avatar;

    @Column(unique = true)
    private String cccd;

    private String maQuanHuyen;
}