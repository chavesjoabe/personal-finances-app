package com.family.finances.transaction.dto;

import com.family.finances.category.entity.Category;
import com.family.finances.member.entity.Member;
import com.family.finances.transaction.entity.Transaction;

import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CreateTransactionRequest {

    @NotNull(message = "Member ID is required")
    public String memberId;

    @NotNull(message = "Category ID is required")
    public String categoryId;

    @NotNull(message = "Transaction type is required")
    public TransactionType type;

    public String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    public BigDecimal amount;

    @NotNull(message = "Year is required")
    public Integer year;

    @NotNull(message = "Month is required")
    public Integer month;

    @NotNull(message = "Period is required")
    public Period period;

    @NotNull(message = "Status is required")
    public TransactionStatus status;

    public String copiedFrom;
}