package com.tutoroo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "Password không được để trống")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
        message = "Vui lòng nhập Gmail hợp lệ"
    )
    private String email;

    @NotBlank(message = "OTP không được để trống")
    @Pattern(regexp = "\\d{6}", message = "OTP phải đúng 6 số")
    private String otp;

    @NotBlank(message = "State không được để trống")
    @Pattern(
        regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
        message = "State phải đúng định dạng"
    )
    private String state;


}
