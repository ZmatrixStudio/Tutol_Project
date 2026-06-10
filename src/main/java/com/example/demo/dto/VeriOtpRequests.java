package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VeriOtpRequests {
    @NotBlank(message = "Mã OTP không được để trống")
    @Size(max = 4, message = "Mã OTP không chính xác")
    private String otp;

    public void setOtp(String otp){
        this.otp = otp;
    }

    public String getOtp(){
        return otp;
    }
}
