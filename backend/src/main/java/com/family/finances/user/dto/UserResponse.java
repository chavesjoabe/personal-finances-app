package com.family.finances.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserResponse {

    public String id;

    @JsonProperty("_id")
    public String getUnderscoreId() {
        return id;
    }

    public String name;
    public String email;
}