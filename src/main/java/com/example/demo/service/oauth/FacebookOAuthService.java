package com.example.demo.service.oauth;

import com.example.demo.dto.FacebookRequest;
import com.example.demo.security.RecaptchaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

// CHECK TOKEN 
// SO SÁNH GIỮA DỮ LIỆU TOKEN TRẢ VỀ USER_ID
@Service
public class FacebookOAuthService {
    private static final String APP_TOKEN = "3940751182724418|xeOXvETDYuuSJmVlXoOB6jjde_I";
    
    @Autowired
    private RecaptchaService recaptchaService;
    public ResponseEntity<?> verifyToken(FacebookRequest request){
        try {
            // CHECK CAPTCHA
            // String recaptchaToken = request.getRecaptchaToken();
            // if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
            //     return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            // }

            // LẤY THÔNG TIN Ở RESPONSE
            String accessTokenUser = request.getAccessToken();

            // CHECK TOKEN
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/debug_token"
                    + "?input_token=" + accessTokenUser
                    + "&access_token=" + APP_TOKEN;

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
                String avatar = infoData.path("picture")
                                    .path("data")
                                    .path("url")
                                    .asText();
                
                if (facebookId.trim().equals(userId.trim())){
                    // TRẢ VỀ ACCESS TOKEN VÀ REFRESH TOKEN
                    return ResponseEntity.ok(Map.of("status", 200,"msg", "Xác thực thành công !!",
                                            "data", Map.of(
                                                "accessToken", "",
                                                "refreshToken", ""
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
