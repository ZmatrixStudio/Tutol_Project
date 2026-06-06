package com.example.demo.service;

import com.example.demo.dto.OtpData;
import com.example.demo.store.OtpStore;
import com.example.demo.util.OtpGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// GỬI MÃ OTP
@Service 
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String email, String username, String password){
        String otp = OtpGenerator.generateOtp();
        long expireTime = System.currentTimeMillis() + 120_000; 
        // Lưu OTP
        OtpStore.otpMap.put(email, new OtpData(otp, expireTime, username, password));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("TutolApplication <tutolapplication@gmail.com>");// Tên xuất hiện trước khi bấm vào nhận Otp
        message.setTo(email);// Người nhận
        message.setText("Xin chào "+email);
        message.setText("Chúng tôi đã nhận được yêu cầu mã dùng một lần cho tài khoản của bạn!");
        message.setText("MÃ OTP 4 SỐ CỦA BẠN LÀ: " + otp); // Nội dung
        message.setSubject("Mã dùng một lần của bạn"); // Tiêu đề

        mailSender.send(message);
        System.out.println("[DEVBUG] -> "+otp);
    }
}

// Luồng xử lí lưu email, otp, thời gian otp live, password, username
// Khi user gửi veri lên thì sẽ kiểm tra username , password, email và otp rồi trả về token