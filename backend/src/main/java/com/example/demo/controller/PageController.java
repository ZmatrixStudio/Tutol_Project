package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class PageController {

    @Value("${recaptcha.site-key}") private String recaptchaSiteKey;
    @Value("${google.client-id}") private String clientId;
    @Value("${facebook.app-id}") private String appId;
    @Value("${facebook.version}") private String facebookVersion;

    /**
     * Tự động nạp cấu hình dùng chung vào Model của tất cả các Request trong Controller này.
     * Giúp code gọn, sạch, dễ bảo trì.
     */
    @ModelAttribute
    public void addCommonAttributes(Model model) {
        model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
        model.addAttribute("googleClientId", clientId);
        model.addAttribute("facebookAppId", appId);
        model.addAttribute("facebookVersion", facebookVersion);
    }

    @GetMapping("/")
    public String home() {
        // Vì SecurityConfig đã bắt buộc chặn từ vòng ngoài, 
        // ai vào được đến đây chắc chắn đã Đăng nhập. Trả thẳng về view index!
        return "index";
    }

    @GetMapping("/login")
    public String login(Authentication auth) {
        if (isAuthenticated(auth)) {
            return "redirect:/";
        }
        return "login";
    }

    @GetMapping("/register")
    public String register(Authentication auth) {
        if (isAuthenticated(auth)) {
            return "redirect:/";
        }
        return "register";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "forgot-password";
    }

    // Viết hàm tiện ích riêng kiểm tra trạng thái đăng nhập thực tế của người dùng
    private boolean isAuthenticated(Authentication auth) {
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }
}