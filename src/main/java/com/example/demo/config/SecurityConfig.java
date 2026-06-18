package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .httpBasic(basic -> basic.disable())
            
            // 1. CHUYỂN THÀNH IF_REQUIRED: Để Backend có thể tạo session lưu trạng thái Auth sau khi check Cookie
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )

            // 2. Đưa Custom JWT Filter vào trước
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // 3. QUYẾT ĐỊNH PHÂN QUYỀN TỪ BACKEND
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/login", "/register", "/forgot-password",
                    "/api/v1/auth/**", "/api/v1/oauth/**",
                    "/css/**", "/js/**", "/image/**" // Chỉ cho phép tải tài nguyên tĩnh, KHÔNG permitAll "/" hay "/pages/**"
                ).permitAll() 
                
                // Tất cả các trang còn lại (bao gồm cả trang chủ "/" và "/#history") BẮT BUỘC phải đăng nhập
                .anyRequest().authenticated() 
            )

            // 4. Cấu hình điểm đá về trang login nếu chưa auth
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("ACTK", "JSESSIONID") // Xóa sạch cả token lẫn Session ID của Spring
                .clearAuthentication(true)
                .invalidateHttpSession(true)
                .logoutSuccessUrl("/login?logout")
            );

        return http.build();
    }
}