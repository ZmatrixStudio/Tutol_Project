package com.tutoroo.backend.repository;

import com.tutoroo.backend.entity.TaiKhoan;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {

    // =========================
    // 🔍 BASIC
    // =========================

    Optional<TaiKhoan> findByMaTaiKhoan(Long maTaiKhoan);

    List<TaiKhoan> findByRole(String role);

    List<TaiKhoan> findByEmailVerified(Boolean emailVerified);

    // =========================
    // 🔐 LOGIN QUERY (IMPORTANT)
    // =========================

    @Query("""
        SELECT tk FROM TaiKhoan tk
        JOIN tk.localAccount la
        WHERE la.email = :email
    """)
    Optional<TaiKhoan> findByEmail(@Param("email") String email);

    // =========================
    // ⏱ LAST LOGIN (OPTIMIZED)
    // =========================

    @Modifying
    @Transactional
    @Query("""
        UPDATE TaiKhoan tk
        SET tk.lastLoginAt = CURRENT_TIMESTAMP
        WHERE tk.maTaiKhoan = :id
    """)
    void updateLastLogin(@Param("id") Long id);

    // =========================
    // 📊 ADMIN STATS
    // =========================

    @Query("SELECT COUNT(tk) FROM TaiKhoan tk")
    long countAllUsers();

    @Query("SELECT COUNT(tk) FROM TaiKhoan tk WHERE tk.role = :role")
    long countByRole(@Param("role") String role);

    // =========================
    // 📅 RANGE SEARCH
    // =========================

    @Query("""
        SELECT tk FROM TaiKhoan tk
        WHERE tk.createdAt BETWEEN :from AND :to
    """)
    List<TaiKhoan> findUsersBetween(
            @Param("from") Instant from,
            @Param("to") Instant to
    );

    // =========================
    // ⚡ FILTER (ADMIN SEARCH)
    // =========================

    @Query("""
        SELECT tk FROM TaiKhoan tk
        WHERE (:role IS NULL OR tk.role = :role)
        AND (:verified IS NULL OR tk.emailVerified = :verified)
    """)
    List<TaiKhoan> filterUsers(
            @Param("role") String role,
            @Param("verified") Boolean verified
    );
}