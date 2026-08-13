package com.family.finances.transaction.mapper;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionRequest;
import com.family.finances.transaction.dto.TransactionResponse;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class TransactionMapper {

    public Transaction toEntity(CreateTransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.memberId = new ObjectId(request.memberId);
        transaction.categoryId = new ObjectId(request.categoryId);
        transaction.type = request.type;
        transaction.description = request.description;
        transaction.amount = request.amount;
        transaction.year = request.year;
        transaction.month = request.month;
        transaction.period = request.period;
        transaction.status = request.status;
        transaction.paidAt = request.status == TransactionStatus.PAID ? Instant.now() : null;
        if (request.copiedFrom != null && !request.copiedFrom.isBlank()) {
            transaction.copiedFrom = new ObjectId(request.copiedFrom);
        }
        return transaction;
    }

    public void updateEntityFromRequest(UpdateTransactionRequest request, Transaction transaction) {
        if (request.memberId != null && !request.memberId.isBlank()) {
            transaction.memberId = new ObjectId(request.memberId);
        }
        if (request.categoryId != null && !request.categoryId.isBlank()) {
            transaction.categoryId = new ObjectId(request.categoryId);
        }
        if (request.type != null) {
            transaction.type = request.type;
        }
        if (request.description != null) {
            transaction.description = request.description;
        }
        if (request.amount != null) {
            transaction.amount = request.amount;
        }
        if (request.year != null) {
            transaction.year = request.year;
        }
        if (request.month != null) {
            transaction.month = request.month;
        }
        if (request.period != null) {
            transaction.period = request.period;
        }
        if (request.status != null) {
            transaction.status = request.status;
            if (request.status == TransactionStatus.PAID && transaction.paidAt == null) {
                transaction.paidAt = Instant.now();
            } else if (request.status == TransactionStatus.PENDING) {
                transaction.paidAt = null;
            }
        }
    }

    public TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.id = transaction.id != null ? transaction.id.toHexString() : null;
        response.memberId = transaction.memberId != null ? transaction.memberId.toHexString() : null;
        response.categoryId = transaction.categoryId != null ? transaction.categoryId.toHexString() : null;
        response.type = transaction.type;
        response.description = transaction.description;
        response.amount = transaction.amount;
        response.year = transaction.year;
        response.month = transaction.month;
        response.period = transaction.period;
        response.status = transaction.status;
        response.paidAt = transaction.paidAt != null ? transaction.paidAt.toString() : null;
        response.copiedFrom = transaction.copiedFrom != null ? transaction.copiedFrom.toHexString() : null;
        response.createdAt = transaction.createdAt != null ? transaction.createdAt.toString() : null;
        response.updatedAt = transaction.updatedAt != null ? transaction.updatedAt.toString() : null;
        return response;
    }

    public List<TransactionResponse> toResponseList(List<Transaction> transactions) {
        return transactions.stream().map(this::toResponse).toList();
    }
}