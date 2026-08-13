package com.family.finances.category.dto;

import com.family.finances.transaction.entity.TransactionType;

public class UpdateCategoryRequest {

    public String name;
    public TransactionType type;
    public String color;
    public Boolean active;
}