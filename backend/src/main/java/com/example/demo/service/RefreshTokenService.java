package com.example.demo.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.entity.RefreshToken;
import com.example.demo.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository){
        this.refreshTokenRepository = refreshTokenRepository;
    }
    // Thời gian sống của Refresh-token 
    private static final long REFRESH_EXP_MS = 7L * 24 * 60 * 60 * 1000;
    
    // Tạo ra 1 chuỗi token 
    private String generateTokenValue(){
        byte[] random = new byte[64];
        new SecureRandom().nextBytes(random);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(random);
    }

    // Tạo và lưu 
    public RefreshToken create(Long userId){
        RefreshToken rt = new RefreshToken();
        rt.setUserId(userId);
        rt.setToken(generateTokenValue());
        rt.setExpiryDate(Instant.now().plusMillis(REFRESH_EXP_MS));
        rt.setRevoked(false);
        return refreshTokenRepository.save(rt);
    }

    // Xác thực token
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(t -> this.verifyExpiration(t)); // <--- Gọi ở đây để hết báo lỗi "never used"
    }

    // Kiểm tra hiệu lực 
    private RefreshToken verifyExpiration(RefreshToken token) {
        // Nếu ngày hết hạn nhỏ hơn thời gian hiện tại HOẶC token đã bị thu hồi (revoked = true)
        if (token.getExpiryDate().isBefore(Instant.now()) || token.isRevoked()) {
            refreshTokenRepository.delete(token); // Xóa khỏi DB luôn cho sạch
            throw new RuntimeException("Refresh token đã hết hạn hoặc không còn hiệu lực. Vui lòng đăng nhập lại!");
        }
        return token;
    }

    // Hủy token khi người dùng logout
    @org.springframework.transaction.annotation.Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

}
