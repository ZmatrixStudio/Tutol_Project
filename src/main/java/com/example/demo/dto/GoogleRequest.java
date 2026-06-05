package com.example.demo.dto;

public class GoogleRequest {
    private String auth;
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
