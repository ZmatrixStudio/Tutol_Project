package com.tutoroo.backend.entity;

import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*; 
import lombok.*;              

@Entity
@Table(
        name = "local_account",
        uniqueConstraints = { @UniqueConstraint(name = "uq_local_email", columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocalAccount {
    @Id
    @Column(name = "ma_tai_khoan")
    private Long maTaiKhoan;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "mat_khau", nullable = false, length = 255)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable =false)
    private Instant createdAt;
}
