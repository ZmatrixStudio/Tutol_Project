package com.example.demo.security;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;

@Service
public class RecaptchaService {

    private final String RECAPTCHA_API_URL =
            "https://www.google.com/recaptcha/api/siteverify";

    private final String SECRET_KEY =
            "6LdaoAwtAAAAAF_ylwpNN6CrXYs9e2jBBrYMMdJH";

    public boolean verifyRecaptcha(String recaptchaResponse) {
        if (recaptchaResponse == null || recaptchaResponse.isBlank()) {
            return false;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("secret", SECRET_KEY);
            params.add("response", recaptchaResponse);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map<String, Object>> responseEntity =
                    restTemplate.exchange(
                            RECAPTCHA_API_URL,
                            HttpMethod.POST,
                            request,
                            new ParameterizedTypeReference<Map<String, Object>>() {}
                    );

            Map<String, Object> response = responseEntity.getBody();

            if (response == null) {
                return false;
            }

            boolean success = Boolean.TRUE.equals(response.get("success"));

            if (!success) {
                System.out.println("ERROR CODES: " + response.get("error-codes"));
            }

            return success;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}