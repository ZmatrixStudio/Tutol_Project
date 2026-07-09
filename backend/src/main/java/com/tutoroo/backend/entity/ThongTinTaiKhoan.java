package com.tutoroo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "thong_tin_tai_khoan", uniqueConstraints = {@UniqueConstraint(name = "uq_profile_phone", columnNames = "so_dien_thoai"),
                                                          @UniqueConstraint(name = "uq_profile_cccd", columnNames = "cccd")})
public class ThongTinTaiKhoan {
    @Id
    @Column(name = "ma_tai_khoan")
    private Long id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(name ="username", nullable = false, length = 150)
    private String username;

    @Column(name = "so_dien_thoai", length = 15 )
    private String soDienThoai;

    @Column(name = "dia_chi_chi_tiet")
    private String diaChiChiTiet;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "ma_quan_huyen")
    private String maQuanHuyen;


}


