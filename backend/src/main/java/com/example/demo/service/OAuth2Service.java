package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.demo.entity.OAuth2;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.entity.ThongTinTaiKhoan;
import com.example.demo.repository.OAuth2Repository;
import com.example.demo.repository.TaiKhoanRepository;

@Service
public class OAuth2Service {

    private final OAuth2Repository oAuth2Repository;
    private final TaiKhoanRepository taiKhoanRepository;

    public OAuth2Service(
            OAuth2Repository oAuth2Repository,
            TaiKhoanRepository taiKhoanRepository) {

        this.oAuth2Repository = oAuth2Repository;
        this.taiKhoanRepository = taiKhoanRepository;
    }

    public TaiKhoan google(String googleId,String email,String ten,String linkAvatar) {

        // kiểm tra email đã tồn tại chưa 
        TaiKhoan taiKhoan = taiKhoanRepository.findByEmailAndProvider(email, "google").orElse(null);
        
        if (taiKhoan == null) {

            taiKhoan = new TaiKhoan();
            taiKhoan.setEmail(email);
            taiKhoan.setMatKhau("");
            taiKhoan.setLastLoginAt(LocalDateTime.now());

            ThongTinTaiKhoan thongTin = new ThongTinTaiKhoan();
            thongTin.setUsername(ten);
            thongTin.setAvatar(linkAvatar);

            taiKhoan.setThongTinTaiKhoan(thongTin);

            taiKhoan = taiKhoanRepository.save(taiKhoan);

        } else { // Nếu tồn tại thì cập nhật last_login

            taiKhoan.setLastLoginAt(LocalDateTime.now());

            ThongTinTaiKhoan thongTin = taiKhoan.getThongTinTaiKhoan();

            if (thongTin != null &&
                (thongTin.getAvatar() == null || thongTin.getAvatar().isBlank())) {

                thongTin.setAvatar(linkAvatar);
            }

            taiKhoan = taiKhoanRepository.save(taiKhoan);
        }

        // kiểm tra đã liên kết Google chưa
        if (!oAuth2Repository.existsByProviderAndProviderUserId(
                "google",
                googleId)) {

            OAuth2 oauth2 = new OAuth2();
            oauth2.setTaiKhoan(taiKhoan);
            oauth2.setProvider("google");
            oauth2.setProviderUserId(googleId);

            oAuth2Repository.save(oauth2);
        } 

        return taiKhoan;
    }

    public TaiKhoan facebook(String facebookId, String email, String ten, String linkAvatar){

        // KIỂM TRA XEM BẢNG OAUTH2 ĐÃ CÓ TÀI KHOẢN facebookId ĐÓ CHƯA
        OAuth2 oAuth2 = oAuth2Repository.findByProviderAndProviderUserId("facebook", facebookId).orElse(null);

        // Đã liên kết facebook
        if (oAuth2 != null){
            TaiKhoan taiKhoan = oAuth2.getTaiKhoan();
            taiKhoan.setLastLoginAt(LocalDateTime.now());
            taiKhoanRepository.save(taiKhoan);
            return taiKhoan;
        }

        // Nếu chưa có thì tạo 
        TaiKhoan taiKhoan = new TaiKhoan();

        taiKhoan.setEmail(email);
        taiKhoan.setMatKhau("");
        taiKhoan.setLastLoginAt(LocalDateTime.now());

        ThongTinTaiKhoan thongTin = new ThongTinTaiKhoan();
        thongTin.setUsername(ten);
        thongTin.setAvatar(linkAvatar);

        taiKhoan.setThongTinTaiKhoan(thongTin);

        taiKhoan = taiKhoanRepository.save(taiKhoan);

        OAuth2 oauth2Moi = new OAuth2();
        oauth2Moi.setTaiKhoan(taiKhoan);
        oauth2Moi.setProvider("facebook");
        oauth2Moi.setProviderUserId(facebookId);

        oAuth2Repository.save(oauth2Moi);

        return taiKhoan;

    }
}