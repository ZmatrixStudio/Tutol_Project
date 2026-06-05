package com.example.demo.service.oauth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;

// Check data google
public class GoogleOAuthService {
    private static final String CLIENT_ID = "135399930194-pmatudppnlqs1rbc6ffna5l2648doka4.apps.googleusercontent.com";

    public static Payload verifyToken(String idTokenString){
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
            .setAudience(Collections.singleton(CLIENT_ID)).build();

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
                return payload;
            } else {
                return null;
            }

        } catch (Exception e){
            System.out.println("Lỗi trong quá trình verify: " + e.getMessage());
            return null;
        }
    }
}
