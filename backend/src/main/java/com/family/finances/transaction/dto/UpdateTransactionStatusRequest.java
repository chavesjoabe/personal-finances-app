package com.family.finances.transaction.dto;

import com.family.finances.transaction.entity.TransactionStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTransactionStatusRequest {

    @NotNull(message = "Status is required")
    public TransactionStatus status;
}