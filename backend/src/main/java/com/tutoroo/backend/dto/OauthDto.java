package com.tutoroo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OauthDto {
    @NotBlank(message = "Token không được để trống")
    private String token;
}
