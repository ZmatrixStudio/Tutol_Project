package com.tutoroo.backend.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import com.tutoroo.backend.dto.VeriOtpDto;
import com.tutoroo.backend.model.TempOtpData;
import com.tutoroo.backend.store.TempOtpStore;
import com.tutoroo.backend.util.AESUtil;

public class VeriOtpService {
    public ResponseEntity<?> checkOtp(VeriOtpDto veriOtpDt, HttpHeaders headers){
        String otp = veriOtpDt.getOtp();
        if (otp == null || otp.isBlank()){
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Vui lòng nhập mã OTP"));
        }
        String t_token = headers.getFirst("T-TOKEN");
        if (t_token == null) {
            return ResponseEntity.status(404).body(Map.of("status","404","success", false, "message", "Vui lòng đăng kí tài khoản trước !"));
        }

        String data;
        try {
            data = AESUtil.decrypt(t_token);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Invalid or corrupted token"));

        }
        
        String[] arr = data.split("\\|");

        String firstName = arr[0];
        String lastName  = arr[1];
        String email     = arr[2];
        String type      = arr[3];

        TempOtpData temp = TempOtpStore.get(email);

        if (temp == null) {
            return ResponseEntity.status(404).body(Map.of("status","404","success", false, "message", "Vui lòng đăng kí tài khoản trước !"));
        }

        if (temp.getFirstName() != firstName && temp.getLastName() != lastName && temp.getEmail() != email && temp.getType() != type){
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Vui lòng đăng kí lại!!"));
        }

        if (temp.getExpiredAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Token hết hạn !"));
        } 

        if (temp.getOtp() != otp){
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Vui lòng nhập đúng OTP "));
        }

        if (temp.getOtp() == otp && "REGISTER".equals(type)){
            return ResponseEntity.status(200).body(Map.of("status","200","success", true, "message", "Đăng kí tài khoản thành công !!"));
        } else {
            return ResponseEntity.status(200).body(Map.of("status","200","success", true, "message", ""));

        }
    }
}
