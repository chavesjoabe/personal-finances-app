package com.family.finances.category.dto;

import com.family.finances.transaction.entity.Transaction;

import com.family.finances.transaction.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCategoryRequest {

    @NotBlank(message = "Name cannot be blank")
    public String name;

    @NotNull(message = "Transaction type is required")
    public TransactionType type;

    public String color;
}