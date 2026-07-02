package com.tutoroo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

import lombok.Data;

@Data
public class IdentifierDto {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
        message = "Vui lòng nhập Gmail hợp lệ"
    )
    private String email;

    @NotBlank(message = "Purpose không được để trống")
    private String purpose;
}