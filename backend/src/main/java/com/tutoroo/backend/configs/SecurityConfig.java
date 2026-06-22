package com.tutoroo.backend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình tạm thời cho phép tất cả các API đều có thể truy cập tự do mà không bị chặn đăng nhập
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt csrf để dễ test Postman
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Cho phép truy cập tất cả API công khai
            );
        return http.build();
    }
}