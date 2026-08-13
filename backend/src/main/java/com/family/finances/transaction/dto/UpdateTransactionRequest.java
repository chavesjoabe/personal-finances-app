package com.family.finances.transaction.dto;

import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;

import java.math.BigDecimal;

public class UpdateTransactionRequest {

    public String memberId;
    public String categoryId;
    public TransactionType type;
    public String description;
    public BigDecimal amount;
    public Integer year;
    public Integer month;
    public Period period;
    public TransactionStatus status;
}