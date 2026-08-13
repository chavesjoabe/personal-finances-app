package com.family.finances.category.dto;

import com.family.finances.transaction.entity.TransactionType;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoryResponse {

    public String id;

    @JsonProperty("_id")
    public String getUnderscoreId() {
        return id;
    }

    public String name;
    public TransactionType type;
    public String color;
    public boolean isSystem;
    public boolean active;
}