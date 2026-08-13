package com.family.finances.member.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateMemberRequest {

    @NotBlank(message = "Name cannot be blank")
    public String name;

    public String color;
}