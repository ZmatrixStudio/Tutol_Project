package com.example.demo.scheduler; // Thay đổi theo package thực tế của dự án bạn

import com.example.demo.store.OtpStore;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// XÓA TOÀN BỘ MÃ OTP TRONG MAP NẾU HẾT HẠN
@Component
public class OtpCleanUpScheduler {
    @Scheduled(fixedRate = 300000)
    public void cleanExpiredOtp() {
        long now = System.currentTimeMillis();
        if (OtpStore.otpMap != null && !OtpStore.otpMap.isEmpty()) {
            OtpStore.otpMap.entrySet().removeIf(entry -> now > entry.getValue().getExpireTime());
            System.out.println("--- [Scheduler] Đã quét và dọn dẹp các mã OTP hết hạn ---");
        }
    }
}