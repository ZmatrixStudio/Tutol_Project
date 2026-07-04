package com.tutoroo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ForgotDto {
    @NotBlank(message = "Password không được để trống")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
        message = "Vui lòng nhập Gmail hợp lệ"
    )
    private String email;

    @NotBlank(message = "NX1DEBUG không được để trống")
    @JsonProperty("NX1DEBUG")
    private String NX1DEBUG;


}
