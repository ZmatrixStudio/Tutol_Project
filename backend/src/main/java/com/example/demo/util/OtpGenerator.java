package com.example.demo.util;

// GEN OTP 4 NUMBER
public class OtpGenerator {
    public static String generateOtp(){
        int otp = (int)(Math.random()*9000) + 1000; // otp từ 1000 đến 9999
        return String.valueOf(otp);
    } 
}
