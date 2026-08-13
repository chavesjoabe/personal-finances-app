package com.family.finances.user.dto;

public class AuthResponse {

    public String token;
    public UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}