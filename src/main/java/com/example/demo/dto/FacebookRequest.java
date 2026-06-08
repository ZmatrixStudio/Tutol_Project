package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class FacebookRequest {
    @NotBlank(message = "Trường TOKEN không được để trống")
    private String accessToken;

    @NotBlank(message = "Trường reCaptcha không được để trống !!")
    private String recaptchaToken;

    public void setAccessToken(String accessToken){
        this.accessToken = accessToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public String getAccessToken(){
        return accessToken;
    }
}
