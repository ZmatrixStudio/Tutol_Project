package com.example.demo.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AESGCMDecrypt {

    private String nonceHex;
    private String cipherHex;
    private byte[] key;

    public AESGCMDecrypt() {}

    public AESGCMDecrypt(String nonceHex, String cipherHex, byte[] key) {
        this.nonceHex = nonceHex;
        this.cipherHex = cipherHex;
        this.key = key;
    }

    public static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }

    public String decrypt() throws Exception {

        byte[] currentKey = key;

        byte[] nonce = hexToBytes(this.nonceHex);
        byte[] cipher = hexToBytes(this.cipherHex);

        GCMParameterSpec spec = new GCMParameterSpec(128, nonce);
        SecretKeySpec keySpec = new SecretKeySpec(currentKey, "AES");

        Cipher cipherObj = Cipher.getInstance("AES/GCM/NoPadding");
        cipherObj.init(Cipher.DECRYPT_MODE, keySpec, spec);

        byte[] plaintext = cipherObj.doFinal(cipher);

        return new String(plaintext);
    }

    // public static void main(String[] args) throws Exception {

    //     String nonceHex = "1952e6ae64f9398aadd43a88";
    //     String cipherHex = "e9708d5848a89548991dcc39182cc3255e6cac00a2af5525d2f2bd";

    //     AESGCMDecrypt aes = new AESGCMDecrypt(nonceHex, cipherHex);

    //     String result = aes.decrypt();

    //     System.out.println("Plain: " + result);
    // }
}