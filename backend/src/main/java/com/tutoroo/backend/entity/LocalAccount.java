package com.tutoroo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "local_account")
@Getter
@Setter
@NoArgsConstructor
public class LocalAccount extends BaseEntity {

    @Id
    private Long maTaiKhoan;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private String matKhau;
}