package com.tutoroo.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

import lombok.*;

@Entity
@Table(name = "tai_khoan")
@Getter
@Setter
@NoArgsConstructor
public class TaiKhoan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maTaiKhoan;

    @Column(nullable = false)
    private String role = "USER";

    @Column(nullable = false)
    private Boolean emailVerified = false;

    private Instant lastLoginAt;

    // RELATION

    @OneToOne(mappedBy = "taiKhoan", cascade = CascadeType.ALL)
    private LocalAccount localAccount;

    @OneToMany(mappedBy = "taiKhoan", cascade = CascadeType.ALL)
    private List<OAuth2Account> oauth2Accounts;

    @OneToOne(mappedBy = "taiKhoan", cascade = CascadeType.ALL)
    private Profile profile;

    @OneToMany(mappedBy = "taiKhoan", cascade = CascadeType.ALL)
    private List<RefreshToken> refreshTokens;
}