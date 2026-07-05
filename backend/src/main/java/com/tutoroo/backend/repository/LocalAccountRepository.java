package com.tutoroo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutoroo.backend.entity.LocalAccount;

@Repository
public interface LocalAccountRepository extends JpaRepository<LocalAccount, Long> {
    // TÌM KIẾM EMAIL VÀ LẤY RA CÁC THÔNG SỐ
    Optional<LocalAccount> findByEmail(String email);

    // CHECK XEM EMAIL CÓ TRONG BẢNG CHƯA 
    boolean existsByEmail(String email);


    
} 