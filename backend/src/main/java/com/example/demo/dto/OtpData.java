package com.example.demo.dto;

public class OtpData {

    private String otp;
    private long expireTime;

    private String username;
    private String password;

    public OtpData(String otp, long expireTime, String username, String password) {
        this.otp = otp;
        this.expireTime = expireTime;
        this.username = username;
        this.password = password;
    }

    public String getOtp() {
        return otp;
    }

    public long getExpireTime() {
        return expireTime;
    }

    public String getUsername(){
        return username;
    }

    public String getPassword(){
        return password;
    }
}