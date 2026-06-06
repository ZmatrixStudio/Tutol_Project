package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

public class RSADecrypt {
    private static final String PRIVATE_KEY_PEM = """
            -----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgVgkW/JFvok7O
V+WUTKicC4simt1gqYm84tCbXdSMZlfvEm8hjC+SccYKdkVaX4QCliW+e8s9siIn
Mp8sunC5HrwzJnBytIzvNfpEsES2dCati6g8HcEjqohpikZT8DRYPVnKxgrupGi5
dVhDujCsGilr+J59b0q2RJPy4yUsKY6tmdXmuyrPmVoY7xP5EDb7yfo61X9y8xyJ
v0dpEy2qgVLCsDZFA4WI1kKzVcvVhh5ty5l94RnKYGcZbHiTK3oMFXxY62jUzLo9
Z2RCq/IDdj5atAiPXVrEIWpDfNddfwPYSAutPwEdXn//Vd7xNmtCxxLcAXGyiHGH
9duLMw2JAgMBAAECggEAIjmrUA5S5z8AznghyBHDDihCp3ziU59tCPZrrDaPx/aS
v7QyJ7macAq8SQBtFnj8H2c4oFwhisZrFu3t32je5g1DBDIo37tduDRP+3ia+k15
8iK1IzwAveHJo6nCEGneapWSBMBYlg9fUXNUh4SHnj0paWRVRJZMnvKtmDPXfAD+
QPEY6PsJiX1KFNt56HIMXIY8wkuiO7p1QqZllAppHnO2tSJ1jNOgDVPZI2uMsB/8
+xHEKap/YgkIWicrWw15TVwL/SV1E0APtAYH4oQfQJcduMqXzt8ginN6x3pFDYXv
4h1wS/cJqMrl8PzXJqQwxGrrXummaztdNuoEEv9WrwKBgQDZOx8sskFO7/Ushr3a
nm/NCsEXJQ3BgbovlCEJoCKSyHiaNHFwFD5K0yae6jqOui7pYRL0aesqrsI0sXK3
NwojV0+balkUWyoYg2jaTyeZt7w4CQs6sXuGZJXaCh5xcsoIWxRxOmx4qi5M+Pwc
yJEfxJIKV0BAoYPJsm9EExNczwKBgQC8834vsf4p2y3vVP0e5Pr2hpEX/098lp5L
qo0LexzQQ9H3UPwbH0OIxqbIklnd1jPACGqX7lo2y5ruuOeMFg4+8ob1c4JEpscK
EYHPw0LfriloXCOjKA9jPEp6KjdF+pv/B3BU5OUdItDrRAFjTdCTIiFPc0Tnq2oe
KY10RR/2JwKBgB/5EbeUbQRfUSjClEMPOsllIdJ0Q7gNjgfet5YhGbWdCBM6UM/8
SsbcmTyeoQvM34a+IPoUdOaNXkw/KfFJipZ1DWSEnKPgXyvIe7BWIi//2RYuTpbO
9K1tNJkpEB4GlTHxpeqcfMat1a7CnujlpGaWmiAng29/1lPjjXjpjdoFAoGBAJ5M
+TkITEHQ6QkMEQxjFoaXctPCCFv+7BvEhWpK+HbbevtSlAQ9Cx16IJ0FT9j07mJC
Ktuiy14A8opxyzun9sNx+POGlGrjtvmOdU0U79/qT7KpDwpQM6QWDOeQmsI8FZly
KABXzEO+uX2BehAyTz4VaAbiMaZODBe9BE+W4hIdAoGBALGFuU37jJ0/4kq+oLUR
gptFv4HAhLQ/BQ+/7mEYr5SX/qm+9Evbx5+4+smyz8a+bC9z9GEPEmWLheafPfN9
VNGR7hp/OktlrO4ufniqAKlVSjWRFFblkOJ4XlF7jwa1V4S//JIIkdbLAN6MggLB
em2hv2Gxa88SlVFWd+6jpWE9
-----END PRIVATE KEY-----
            """;

    private static PrivateKey getPrivateKey() throws Exception {

        String key = PRIVATE_KEY_PEM
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(key);

        return KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    public static String decrypt(String encryptedBase64) throws Exception {

        PrivateKey privateKey = getPrivateKey();

        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPPadding");

        OAEPParameterSpec oaepParams = new OAEPParameterSpec(
                "SHA-256",
                "MGF1",
                MGF1ParameterSpec.SHA256,
                PSource.PSpecified.DEFAULT
        );

        cipher.init(Cipher.DECRYPT_MODE, privateKey, oaepParams);

        byte[] decrypted = cipher.doFinal(
                Base64.getDecoder().decode(encryptedBase64)
        );

        return new String(decrypted, StandardCharsets.UTF_8);
    }
}
