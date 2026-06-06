package com.example.demo.config;

import com.example.demo.interceptor.RequestValidationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private RequestValidationInterceptor interceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(interceptor)
                .addPathPatterns("/api/**");// Tất cả requests qua api phải qua interceptor
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho phép tất cả các đường dẫn API
                .allowedOrigins("http://127.0.0.1:3000", "http://localhost:3000") // Cho phép cả 2 kiểu gõ của Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); // Các phương thức được phép
    }
}