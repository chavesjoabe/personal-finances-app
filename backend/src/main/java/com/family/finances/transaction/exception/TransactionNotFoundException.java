package com.family.finances.transaction.exception;

import com.family.finances.transaction.entity.Transaction;

public class TransactionNotFoundException extends RuntimeException {

    public TransactionNotFoundException(String transactionId) {
        super("Transaction not found: " + transactionId);
    }
}