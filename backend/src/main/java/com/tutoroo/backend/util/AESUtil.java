package com.tutoroo.backend.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

public class AESUtil {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;
    
    // Sử dụng HexFormat (Java 17+)
    private static final byte[] KEY = HexFormat.of().parseHex(
            "c9688dcae56d6158565d284b88464bbe409956e6defb7f268172b3a44ab452a3"
    );

    public static String encrypt(String data) {
        try {
            byte[] nonce = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(nonce);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(KEY, "AES"), new GCMParameterSpec(GCM_TAG_LENGTH, nonce));

            byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().withoutPadding().encodeToString(encrypted) 
                   + ":" + Base64.getEncoder().encodeToString(nonce);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    public static String decrypt(String token) {
        try {
            String[] parts = token.split(":");
            byte[] encrypted = Base64.getDecoder().decode(parts[0]);
            byte[] nonce = Base64.getDecoder().decode(parts[1]);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(KEY, "AES"), new GCMParameterSpec(GCM_TAG_LENGTH, nonce));

            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}