package com.example.demo.service.oauth;

import com.example.demo.dto.GoogleRequest;
import com.example.demo.security.RecaptchaService;
import com.example.demo.security.TokenSecurityService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

// CHECK AUTH GG VÀ TRẢ DỮ LIỆU
@Service
public class GoogleOAuthService {
    private static final String CLIENT_ID = "135399930194-pmatudppnlqs1rbc6ffna5l2648doka4.apps.googleusercontent.com";

    @Autowired
    private TokenSecurityService tokenSecurityService;

    @Autowired
    private RecaptchaService recaptchaService;

    public  ResponseEntity<?> verifyToken(GoogleRequest request){
        try {
            String recaptchaToken = request.getRecaptchaToken();
            if (recaptchaToken == null || !recaptchaService.verifyRecaptcha(recaptchaToken)) {
                return ResponseEntity.status(400).body(Map.of("status", 400, "msg", "reCAPTCHA verification failed"));
            }
            
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
            .setAudience(Collections.singleton(CLIENT_ID)).build();

            String authBody = request.getAuth();
            // VERI AUTH
            byte[] key = new byte[]{
                (byte) 0xbf, 0x58, 0x73, 0x25, (byte) 0xc9, 0x2b, 0x11, (byte) 0xd1, 
                (byte) 0x87, (byte) 0xf4, (byte) 0xa0, 0x67, 0x19, 0x22, 0x1d, (byte) 0xc0, 
                0x3d, 0x7e, (byte) 0x9a, 0x28, 0x70, (byte) 0xb4, 0x15, 0x73, 
                0x00, 0x29, (byte) 0x85, (byte) 0xe7, (byte) 0xab, (byte) 0x93, (byte) 0x85, 0x7f
            };// KEY VERI AUTH GG
            String[] dataAuth = tokenSecurityService.checkXToken(authBody, key);

            String idTokenString = dataAuth[1];
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null){
                Payload payload = idToken.getPayload();
                String userId = payload.getSubject(); 
                System.out.println("User ID: " + userId);

                // Lấy các thông tin cá nhân khác
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");

                System.out.println("========= GOOGLE USER INFO =========");
                System.out.println("User ID (sub)  : " + userId);
                System.out.println("Email          : " + email);
                System.out.println("Email Verified : " + emailVerified);
                System.out.println("Full Name      : " + name);
                System.out.println("Given Name     : " + givenName);
                System.out.println("Family Name    : " + familyName);
                System.out.println("Picture URL    : " + pictureUrl);
                System.out.println("====================================");
                
                return ResponseEntity.ok(Map.of("status", 200, "msg", "true"));
            } else {
                return ResponseEntity.badRequest()
                     .body(Map.of("status", 400, "msg", "Dữ liệu không chính xác!!"));
            }

        } catch (Exception e){
            System.out.println("[GoogleOAuthService] -> "+e.getMessage());
            return ResponseEntity.internalServerError()
                     .body(Map.of("status", 500, "msg", "Đăng nhập bằng google lỗi!!", "errol", true));
        }
    }
}
