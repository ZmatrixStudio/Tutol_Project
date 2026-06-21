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
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

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
            // 1. CHUYỂN HẲN SANG STATELESS: Tuyệt đối không tạo JSESSIONID, ép Spring check JWT trên mỗi request
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 2. BẬT BẢO VỆ CSRF TUYỆT ĐỐI: Tạo cookie XSRF-TOKEN cho phía Frontend (JS) đọc
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                // Ngoại trừ các endpoint xác thực/đăng nhập ban đầu (lúc này chưa có CSRF token)
                .ignoringRequestMatchers(
                    "/api/v1/auth/send-token",
                    "/api/v1/auth/check-token",
                    "/api/v1/auth/veri-otp",
                    "/api/v1/auth/login",
                    "/api/v1/auth/refresh", // Nhớ thêm route refresh token của bạn vào đây
                    "/api/v1/oauth/**"
                )
            )
            
            .httpBasic(basic -> basic.disable())
            
            // 3. Đưa Custom JWT Filter lên trước để bóc tách Cookie "ACTK"
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // 4. PHÂN QUYỀN TRUY CẬP
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/login", "/register", "/forgot-password",
                    "/api/v1/auth/**", "/api/v1/oauth/**",
                    "/css/**", "/js/**", "/image/**"
                ).permitAll() 
                .anyRequest().authenticated() 
            )

            // 5. Nếu JWT hết hạn hoặc không hợp lệ, trả về mã và đá về /login
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
            )

            // 6. LOGOUT CHUẨN STATELESS: Chỉ cần xóa cookie ACTK và RFTT (nếu có) khỏi trình duyệt
            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("ACTK", "RFTT") 
                .clearAuthentication(true)
                .logoutSuccessUrl("/login?logout")
            );

        return http.build();
    }
}