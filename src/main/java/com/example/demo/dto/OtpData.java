package com.example.demo.dto;

public class OtpData {

    private String otp;
    private long expireTime;

    public OtpData(String otp, long expireTime) {
        this.otp = otp;
        this.expireTime = expireTime;
    }

    public String getOtp() {
        return otp;
    }

    public long getExpireTime() {
        return expireTime;
    }
}