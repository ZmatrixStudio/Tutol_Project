package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "oauth2",uniqueConstraints = {@UniqueConstraint(name = "uq_provider_user",columnNames = {"provider", "provider_user_id"})})
public class OAuth2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "ma_tai_khoan",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_oauth_taikhoan")
    )
    private TaiKhoan taiKhoan;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;

    public OAuth2() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderUserId() {
        return providerUserId;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }
}