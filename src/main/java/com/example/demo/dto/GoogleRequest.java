package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleRequest {

    @NotBlank(message = "Trường token không được để trống!!")
    private String auth;

    @NotBlank(message = "Trường reCaptcha không được để trống !!")
    private String recaptchaToken;

    public GoogleRequest(){}

    public String getAuth(){
        return auth;
    }

    public void setAuth(String auth){
        this.auth = auth;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }
}
