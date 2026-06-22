package com.tutoroo.backend.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutoroo.backend.dto.VeriOtpDto;
import com.tutoroo.backend.entity.LocalAccount;
import com.tutoroo.backend.entity.TaiKhoan;
import com.tutoroo.backend.model.TempOtpData;
import com.tutoroo.backend.repository.LocalAccountRepository;
import com.tutoroo.backend.repository.TaiKhoanRepository;
import com.tutoroo.backend.store.TempOtpStore;
import com.tutoroo.backend.util.AESUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeriOtpService {
    private final LocalAccountRepository localAccountRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
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
        if (arr.length < 4) { // Đề phòng token bị thiếu trường dữ liệu khi split
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Token data format invalid"));
        }

        String firstName = arr[0];
        String lastName  = arr[1];
        String email     = arr[2];
        String type      = arr[3];

        TempOtpData temp = TempOtpStore.get(email);

        if (temp == null) {
            return ResponseEntity.status(404).body(Map.of("status","404","success", false, "message", "Vui lòng đăng kí tài khoản trước !"));
        }

        System.out.println("========= KẾT QUẢ SO SÁNH DỮ LIỆU =========");
        System.out.println("1. FirstName -> Token: [" + firstName + "] | Store: [" + temp.getFirstName() + "]");
        System.out.println("2. LastName  -> Token: [" + lastName  + "] | Store: [" + temp.getLastName() + "]");
        System.out.println("3. Email     -> Token: [" + email     + "] | Store: [" + temp.getEmail() + "]");
        System.out.println("4. Type      -> Token: [" + type      + "] | Store: [" + temp.getType() + "]");
        System.out.println("==========================================");

        if (!firstName.equals(temp.getFirstName())
                || !lastName.equals(temp.getLastName())
                || !email.equals(temp.getEmail())
                || !type.equals(temp.getType())) {
            return ResponseEntity.status(404).body(Map.of("status","404","success", false, "message", "Thông tin xác thực không khớp!"));
        }

        if (temp.getExpiredAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Token hết hạn !"));
        } 

        if (!temp.getOtp().equals(otp)){
            return ResponseEntity.status(400).body(Map.of("status","400","success", false, "message", "Vui lòng nhập đúng OTP "));
        }

        if (temp.getOtp().equals(otp) && "REGISTER".equals(type)){
            TaiKhoan tk = new TaiKhoan();
            tk.setRole("USER");
            tk.setEmailVerified(true);

            TaiKhoan tkSave = taiKhoanRepository.save(tk);

            LocalAccount local = new LocalAccount();
            local.setTaiKhoan(tkSave);
            local.setEmail(email);
            local.setMatKhau(passwordEncoder.encode(temp.getPassword()));

            localAccountRepository.save(local);
            TempOtpStore.remove(email);
            return ResponseEntity.status(200).body(Map.of("status","200","success", true, "message", "Đăng kí tài khoản thành công !!"));
        } else {
            return ResponseEntity.status(200).body(Map.of("status","200","success", true, "message", ""));

        }
    }
}
