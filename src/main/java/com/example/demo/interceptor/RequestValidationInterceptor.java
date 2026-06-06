package com.example.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.demo.security.RateLimitService;
import com.example.demo.security.TokenSecurityService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// LIMIT IP AND X-TOKEN
@Component
public class RequestValidationInterceptor implements HandlerInterceptor{
    @Autowired
    private TokenSecurityService tokenSecurityService;
    @Autowired
    private RateLimitService rateLimitService;

    // LẤY HEADERS 
    @Override
    public boolean preHandle(
        HttpServletRequest httpRequest,
        HttpServletResponse response,
        Object handler){

            try {
                if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
                    return true; // bỏ qua CORS preflight
                }
                // GET X-TOKEN
                String xToken = httpRequest.getHeader("X-Token");
                System.out.println(xToken);
                
                // GET IP
                String ip = httpRequest.getHeader("X-Forwarded-For");
                if (ip == null || ip.isEmpty()){
                    ip = httpRequest.getRemoteAddr();
                }

                byte[] keyXToken = new byte[]{
                        (byte)0xdc,0x30,(byte)0xdd,(byte)0x97,(byte)0xe1,(byte)0xa6,0x13,(byte)0x94,
                        0x1e,0x2f,(byte)0xf0,0x6b,(byte)0xa4,(byte)0xe8,(byte)0xf4,0x67,
                        (byte)0xca,0x29,0x36,(byte)0xa8,(byte)0xd4,(byte)0xf1,0x12,0x12,
                        0x3b,0x38,(byte)0xd1,0x67,(byte)0xf2,0x25,0x3f,0x63
                }; // VERI X-TOKEN
                
                String[] dataXToken = tokenSecurityService.checkXToken(xToken, keyXToken); 
                // 0: Time; 1: Device_id
                String key = ip + "" + dataXToken[1];
                if (!rateLimitService.allow(key)){
                    response.setStatus(429);
                    response.getWriter().write("Too many requests");
                    return false;
                }
                return true;

            } catch (Exception e) {
                System.out.println("[RequestValidationInterceptor] -> "+ e.getMessage());
                return false;
            }
        } 

}