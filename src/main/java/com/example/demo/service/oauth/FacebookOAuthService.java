package com.example.demo.service.oauth;

import com.example.demo.dto.FacebookRequest;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.security.RecaptchaService;
import com.example.demo.service.JwtService;
import com.example.demo.service.OAuth2Service;
import com.example.demo.service.RefreshTokenService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

import java.util.Map;
import java.time.Duration;

// CHECK TOKEN 
// SO SÁNH GIỮA DỮ LIỆU TOKEN TRẢ VỀ USER_ID
@Service
public class FacebookOAuthService {
    @Value("${facebook.app-token}")
    private String appToken;

    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private OAuth2Service oAuth2Service;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired 
    private JwtService jwtService;

    public ResponseEntity<?> verifyToken(FacebookRequest request, HttpServletResponse responseFb){
        try {
            // CHECK CAPTCHA
            String recaptchaToken = request.getRecaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }

            // LẤY THÔNG TIN Ở RESPONSE
            String accessTokenUser = request.getAccessToken();

            // CHECK TOKEN
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/debug_token"
                    + "?input_token=" + accessTokenUser
                    + "&access_token=" + appToken;

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = new ObjectMapper().readTree(response);

            boolean isValid = root.at("/data/is_valid").asBoolean();
            if (isValid){
                String userId = root.at("/data/user_id").asText();
                // CHECK THÔNG TIN 
                String info = "https://graph.facebook.com/me"
                        + "?fields=id,name,email,picture"
                        + "&access_token=" + accessTokenUser;

                String infoRes = restTemplate.getForObject(info, String.class);
                JsonNode infoData = new ObjectMapper().readTree(infoRes);

                String facebookId = infoData.get("id").asText();
                String name = infoData.get("name").asText();
                String email = infoData.has("email")
                                ? infoData.get("email").asText()
                                : null;
                String avatarUrl ="https://graph.facebook.com/" + facebookId + "/picture?type=large";
                
                if (facebookId.trim().equals(userId.trim())){

                    // DATABASE
                    TaiKhoan taiKhoan =  oAuth2Service.facebook(facebookId, email, name, avatarUrl);

                    Long userIdFb = taiKhoan.getMaTaiKhoan();
                    String accessToken = jwtService.generateAccessToken(userIdFb, "Oauth_Facebook");
                    String refreshToken = refreshTokenService.create(userIdFb).getToken();
                    
                    // SET REFRESH TOKEN VÀO HTTPONLY COOKIE
                    ResponseCookie refreshCookie = ResponseCookie.from(
                            "RFTT",
                            "rftt-" + refreshToken // RFTT = REFRESH TOKEN TUTOL
                        )
                        .httpOnly(true)                  // JS không đọc được
                        .secure(true)                    // chỉ HTTPS
                        .path("/")                       // toàn site
                        .maxAge(Duration.ofDays(7))      // 7 ngày
                        .sameSite("Strict")              // chống CSRF
                        .build();

                    responseFb.addHeader(
                            HttpHeaders.SET_COOKIE,
                            refreshCookie.toString()
                    );
                    // TRẢ VỀ ACCESS TOKEN VÀ REFRESH TOKEN
                    return ResponseEntity.ok(Map.of("status", 200,"msg", "Xác thực thành công !!",
                                            "data", Map.of(
                                                "accessToken", accessToken
                                            ),"success", true,"error", 0));
                } else {
                    return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Lỗi xác thực Facebook!! ", "success", false, "errol", 1));

                }
            } else {
                return ResponseEntity.status(401).body(Map.of("status", 401, "msg", "Tài khoản Facebook gặp lỗi, vui lòng xem lại !! ", "success", false, "errol", 1));

            }
        } catch (Exception e) {
            System.out.println("[FacebookOAuthService] -> "+ e.getMessage());
            return ResponseEntity.ok("Lỗi");
        }
    }
}
