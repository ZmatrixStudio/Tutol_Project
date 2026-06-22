package com.tutoroo.backend.dto;

public class VeriOtpDto {
    private String otp;

    public VeriOtpDto() {}

    public VeriOtpDto(String otp) {
        this.otp = otp;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}