package com.tutoroo.backend.dto;

public class GetOtpDto {
    private String lastName;
    private String firstName;
    private String email;
    private String password;
    private String type;

    public GetOtpDto(){}

    public GetOtpDto(String lastName, String firstName, String email, String password, String type){
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.type = type;
    }

    public void setLastName(String lastName){
        this.lastName = lastName;
    }

    public void setFirstName(String firstName){
        this.firstName = firstName;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setType(String type){
        this.type = type;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getType() {
        return type;
    }
}
