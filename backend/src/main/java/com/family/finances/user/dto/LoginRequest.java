package com.family.finances.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address format")
    public String email;

    @NotBlank(message = "Password is required")
    public String password;
}