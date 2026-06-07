package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Trường EMAIL không được để trống !!")
    private String email;

    @NotBlank(message = "Trường mật khẩu không được để trống!!")
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
