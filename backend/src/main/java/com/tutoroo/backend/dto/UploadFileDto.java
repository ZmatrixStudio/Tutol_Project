package com.tutoroo.backend.dto;

import org.springframework.web.multipart.MultipartFile;

import com.tutoroo.backend.enums.OwnerType;
import com.tutoroo.backend.validation.AllowedFileType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UploadFileDto {

    @NotNull(message = "File không được để trống")
    @AllowedFileType(
        types = {
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
    )
    private MultipartFile file;

    @NotNull(message = "ownerType không được để trống")
    private OwnerType ownerType;
}