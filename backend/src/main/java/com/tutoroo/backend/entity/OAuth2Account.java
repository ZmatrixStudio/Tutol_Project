package com.tutoroo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "oauth2_account",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider", "providerUserId"})
    }
)
@Getter
@Setter
@NoArgsConstructor
public class OAuth2Account extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    private String provider;

    private String providerUserId;
}