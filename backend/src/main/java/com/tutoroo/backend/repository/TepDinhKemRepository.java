package com.tutoroo.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutoroo.backend.entity.TepDinhKem;

@Repository
public interface TepDinhKemRepository extends JpaRepository<TepDinhKem, UUID> {
    Optional<TepDinhKem> findByIdAndUploadedBy(UUID  id, Long uploadedBy);
}