package com.tutoroo.backend.model;

import java.time.LocalDateTime;

public class TempOtpData {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String type;
    private String otp;
    private LocalDateTime expiredAt;

    // Constructor
    public TempOtpData(String firstName, String lastName,
                            String email, String password,
                            String type, String otp,
                            LocalDateTime expiredAt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.type = type;
        this.otp = otp;
        this.expiredAt = expiredAt;
    }

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getType() { return type; }
    public String getOtp() { return otp; }
    public LocalDateTime getExpiredAt() { return expiredAt; }
}