package com.tutoroo.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.tutoroo.backend.enums.OwnerType;
import com.tutoroo.backend.enums.StorageProvider;

@Entity
@Table(
    name = "tep_dinh_kem",
    indexes = {
        @Index(name = "idx_tep_owner", columnList = "owner_type, owner_id"),
        @Index(name = "idx_tep_uploaded_by", columnList = "uploaded_by")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TepDinhKem {

    @Id
    @Builder.Default
    @Column(nullable = false, updatable = false)
    private UUID id = UUID.randomUUID();

    /**
     * BAI_TAP, TIN_NHAN, BAI_VIET, TAI_LIEU, UPLOAD_TEMP
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false, length = 50)
    private OwnerType ownerType;

    @Column(name = "owner_id", nullable = true)
    private String ownerId;

    /**
     * TELEGRAM, S3, R2
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "storage_provider", nullable = false, length = 50)
    private StorageProvider storageProvider;

    @Column(name = "storage_key", nullable = false, length = 500)
    private String storageKey;

    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}