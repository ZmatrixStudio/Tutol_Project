package com.tutoroo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tutoroo.backend.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findById(Long id);
    Optional<RefreshToken> findByDeviceId(String deviceId);
    
    // LẤY THÔNG TIN ĐỂ TẠO RA ACCESSTOKEN
    @Query("""
    SELECT
        COALESCE(l.email, o.email),
        t.id,
        t.role,
        r.isBanned
    FROM RefreshToken r
    JOIN r.taiKhoan t
    LEFT JOIN LocalAccount l ON l.taiKhoan = t
    LEFT JOIN Oauth2Account o ON o.taiKhoan = t
    WHERE r.deviceId = :deviceId
    AND r.tokenHash = :tokenHash
    AND r.revoked = false
    AND r.expiryDate > CURRENT_TIMESTAMP
    """)
    Optional<Object[]> findValidUserInfoByRefreshToken(
            @Param("deviceId") String deviceId,
            @Param("tokenHash") String tokenHash
    );
} 
