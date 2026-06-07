package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class VeriOtpRequests {
    @NotBlank(message = "Mã OTP không được để trống")
    private String otp;

    public void setOtp(String otp){
        this.otp = otp;
    }

    public String getOtp(){
        return otp;
    }
}
