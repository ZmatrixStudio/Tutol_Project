package com.example.demo.store;

import com.example.demo.dto.OtpData;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OtpStore {
    public static Map<String, OtpData> otpMap = new ConcurrentHashMap<>();
}