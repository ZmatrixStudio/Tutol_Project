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
    Optional<RefreshToken> findByIdAndDeviceId(Long id, String deviceId);
    Optional<RefreshToken> findByDeviceId(String deviceId);
    
    // LẤY THÔNG TIN ĐỂ TẠO RA ACCESSTOKEN
    @Query("""
        SELECT l.email, t.id, t.role
        FROM RefreshToken r
        JOIN r.taiKhoan t
        JOIN LocalAccount l ON l.taiKhoan = t
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
