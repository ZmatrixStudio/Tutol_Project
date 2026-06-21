package com.example.demo.security;

import com.example.demo.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);
    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        
        try {
            Cookie[] cookies = req.getCookies();
            if (cookies != null) {
                // Dùng Stream API: Vừa Clean code, vừa đạt hiệu năng xử lý tốt
                Arrays.stream(cookies)
                    .filter(cookie -> "ACTK".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .ifPresent(token -> {
                        if (jwtService.validateToken(token)) {
                            Authentication auth = jwtService.buildAuthentication(token);
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    });
            }
        } catch (Exception e) {
            // Chuẩn Production: Luôn bắt lỗi và Log lại để điều tra hệ thống khi cần, không thả trôi Exception
            log.error("Lỗi thiết lập xác thực người dùng tại JwtFilter: {}", e.getMessage());
        }

        // Luôn luôn chạy tiếp chuỗi Filter dù thành công hay thất bại
        chain.doFilter(req, res);
    }
}