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

    @NotBlank(message = "Trường reCaptcha không được để trống!!")
    private String reCaptcha;

    public void setEmail(String email){
        this.email = email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setReCaptcha(String reCaptcha){
        this.reCaptcha = reCaptcha;
    }

    public String getReCaptcha(){
        return reCaptcha;
    }

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }
}
