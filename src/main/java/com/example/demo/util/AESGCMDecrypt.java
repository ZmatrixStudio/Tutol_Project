package com.example.demo.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AESGCMDecrypt {

    private String nonceHex;
    private String cipherHex;

    public AESGCMDecrypt() {}

    public AESGCMDecrypt(String nonceHex, String cipherHex) {
        this.nonceHex = nonceHex;
        this.cipherHex = cipherHex;
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

        byte[] key = new byte[]{
                (byte)0xdc,0x30,(byte)0xdd,(byte)0x97,(byte)0xe1,(byte)0xa6,0x13,(byte)0x94,
                0x1e,0x2f,(byte)0xf0,0x6b,(byte)0xa4,(byte)0xe8,(byte)0xf4,0x67,
                (byte)0xca,0x29,0x36,(byte)0xa8,(byte)0xd4,(byte)0xf1,0x12,0x12,
                0x3b,0x38,(byte)0xd1,0x67,(byte)0xf2,0x25,0x3f,0x63
        };

        byte[] nonce = hexToBytes(this.nonceHex);
        byte[] cipher = hexToBytes(this.cipherHex);

        GCMParameterSpec spec = new GCMParameterSpec(128, nonce);
        SecretKeySpec keySpec = new SecretKeySpec(key, "AES");

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