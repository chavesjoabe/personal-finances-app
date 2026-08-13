package com.family.finances.member.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MemberResponse {

    public String id;

    @JsonProperty("_id")
    public String getUnderscoreId() {
        return id;
    }

    public String name;
    public String color;
    public boolean active;
}