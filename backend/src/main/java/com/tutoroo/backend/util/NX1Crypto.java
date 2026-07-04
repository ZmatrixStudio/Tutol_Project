package com.tutoroo.backend.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class NX1Crypto {

    private static final String PREFIX = "NX1DEBUG.";
    private static final byte XOR_KEY = 0x5A;

    private static final byte[] AES_KEY;

    static {
        try {
            AES_KEY = MessageDigest.getInstance("SHA-256")
                    .digest("f73d19dca78390f99953de2d668c32343980a6dd94d2c6472910347f8dd92379"
                            .getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String customEncode(byte[] data) {
        byte[] reversed = new byte[data.length];

        for (int i = 0; i < data.length; i++) {
            reversed[i] = (byte) (data[data.length - 1 - i] ^ XOR_KEY);
        }

        String encoded = Base64.getEncoder().encodeToString(reversed);

        return PREFIX + encoded;
    }

    public static byte[] customDecode(String text) {
        if (!text.startsWith(PREFIX)) {
            throw new IllegalArgumentException("Invalid format");
        }

        byte[] decoded = Base64.getDecoder()
                .decode(text.substring(PREFIX.length()));

        byte[] result = new byte[decoded.length];

        for (int i = 0; i < decoded.length; i++) {
            result[i] = (byte) (decoded[decoded.length - 1 - i] ^ XOR_KEY);
        }

        return result;
    }

    public static String encrypt(String plainText) throws Exception {

        byte[] nonce = new byte[12];
        new SecureRandom().nextBytes(nonce);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");

        SecretKeySpec keySpec = new SecretKeySpec(AES_KEY, "AES");

        cipher.init(
                Cipher.ENCRYPT_MODE,
                keySpec,
                new GCMParameterSpec(128, nonce)
        );

        byte[] ciphertext = cipher.doFinal(
                plainText.getBytes(StandardCharsets.UTF_8)
        );

        byte[] combined = new byte[nonce.length + ciphertext.length];

        System.arraycopy(nonce, 0, combined, 0, nonce.length);
        System.arraycopy(ciphertext, 0, combined, nonce.length, ciphertext.length);

        return customEncode(combined);
    }

    public static String decrypt(String encodedText) throws Exception {

        byte[] combined = customDecode(encodedText);

        byte[] nonce = new byte[12];
        byte[] ciphertext = new byte[combined.length - 12];

        System.arraycopy(combined, 0, nonce, 0, 12);
        System.arraycopy(combined, 12, ciphertext, 0, ciphertext.length);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");

        SecretKeySpec keySpec = new SecretKeySpec(AES_KEY, "AES");

        cipher.init(
                Cipher.DECRYPT_MODE,
                keySpec,
                new GCMParameterSpec(128, nonce)
        );

        byte[] plaintext = cipher.doFinal(ciphertext);

        return new String(plaintext, StandardCharsets.UTF_8);
    }
}