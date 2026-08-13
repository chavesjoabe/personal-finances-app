package com.family.finances.transaction.dto;

import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class TransactionResponse {

    public String id;

    @JsonProperty("_id")
    public String getUnderscoreId() {
        return id;
    }

    public String memberId;
    public String categoryId;
    public TransactionType type;
    public String description;
    public BigDecimal amount;
    public int year;
    public int month;
    public Period period;
    public TransactionStatus status;
    public String paidAt;
    public String copiedFrom;
    public String createdAt;
    public String updatedAt;
}