package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

public class LoginRequest {

    @NotBlank(message = "Trường EMAIL không được để trống !!")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 150, message = "Email quá dài")
    private String email;

    @NotBlank(message = "Trường mật khẩu không được để trống!!")
    @Size(max = 150, message = "Mật khẩu quá dài")
    private String password;

    @NotBlank(message = "Trường reCaptchaToken không được để trống!!")
    private String reCaptchaToken;

    // EMAIL
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // PASSWORD
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // RECAPTCHA
    public String getReCaptchaToken() {
        return reCaptchaToken;
    }

    public void setReCaptchaToken(String reCaptchaToken) {
        this.reCaptchaToken = reCaptchaToken;
    }
}