package com.example.demo.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static class RateInfo {
        long startTime;
        int count;
    }

    private final ConcurrentHashMap<String, RateInfo> cache = new ConcurrentHashMap<>();

    private static final int LIMIT = 10; // số request
    private static final long WINDOW_MS = 60 * 1000; // 1 phút

    public boolean allow(String key) {

        long now = System.currentTimeMillis();

        RateInfo info = cache.get(key);

        if (info == null) {
            info = new RateInfo();
            info.startTime = now;
            info.count = 1;
            cache.put(key, info);
            return true;
        }

        // nếu qua window 1 phút → reset
        if (now - info.startTime > WINDOW_MS) {
            info.startTime = now;
            info.count = 1;
            return true;
        }

        // trong window
        if (info.count >= LIMIT) {
            return false;
        }

        info.count++;
        return true;
    }
}