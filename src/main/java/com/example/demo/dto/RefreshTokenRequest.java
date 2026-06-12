package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenRequest {
    @NotBlank(message = "Trường RefreshToken không được để trống !! ")
    private String refreshToken;

    public void setRefreshToken(String refreshToken){
        this.refreshToken= refreshToken;
    }

    public String getRefreshToken(){
        return refreshToken;
    }
}
