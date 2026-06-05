package com.example.demo.security;

import org.springframework.stereotype.Service;

import com.example.demo.util.AESGCMDecrypt;
import com.example.demo.util.TokenStore;

// Nhận công việc check x-token
@Service
public class TokenSecurityService {
    public String[] checkXToken(String x_token, byte[] key) throws Exception {
        if (x_token == null || x_token.isEmpty()) {
            throw new RuntimeException("Missing X-Token");
        }

        if (!x_token.contains(".")) {
            throw new RuntimeException("Invalid format (no dot)");
        }

        String[] parts = x_token.split("\\.");

        if (parts.length != 2) {
            throw new RuntimeException("Invalid token parts");
        }

        if (TokenStore.isUsed(x_token)) {
            throw new RuntimeException("Token expired");
        } else {
            TokenStore.markUsed(x_token);
        }

        try {
            AESGCMDecrypt aes = new AESGCMDecrypt(parts[1], parts[0], key);
            String result = aes.decrypt();
            
            String[] check = result.split("\\|");
            if (check.length != 2){
                throw new RuntimeException("Invalid token");
            }
            long now = System.currentTimeMillis();
            long time_requests = Long.parseLong(check[0]);
            if ((now - time_requests) > 30 * 1000) { // Quá 30s là requests hết hạn
                throw new RuntimeException("Request expired");
            } 
            return check;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Decrypt error");
        }
    }
}
