package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.ui.Model;

@Controller
public class PageController {
    
    @Value("${recaptcha.site-key}")
    private String recaptchaSiteKey;

    @Value("${google.client-id}")
    private String clientId;

    @Value("${facebook.app-id}")
    private String appId;

    @Value("${facebook.version}")
    private String facebookVersion;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
        model.addAttribute("googleClientId", clientId);
        model.addAttribute("facebookAppId", appId);
        model.addAttribute("facebookVersion", facebookVersion);
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
        model.addAttribute("googleClientId", clientId);
        model.addAttribute("facebookAppId", appId);
        model.addAttribute("facebookVersion", facebookVersion);
        return "register";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "forgot-password";
    }
}