package com.family.finances.transaction.service;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionRequest;
import com.family.finances.transaction.dto.TransactionResponse;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.exception.TransactionNotFoundException;
import com.family.finances.transaction.mapper.TransactionMapper;
import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.transaction.repository.TransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.time.Instant;

@ApplicationScoped
public class TransactionService {

    @Inject
    TransactionRepository transactionRepository;

    @Inject
    MemberRepository memberRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    TransactionMapper transactionMapper;

    public TransactionResponse createTransaction(String userId, CreateTransactionRequest createTransactionRequest) {
        Transaction transaction = transactionMapper.toEntity(createTransactionRequest);
        if (userId != null) {
            transaction.userId = new ObjectId(userId);
        }
        transaction.createdAt = Instant.now();
        transaction.updatedAt = Instant.now();
        transactionRepository.persist(transaction);
        return transactionMapper.toResponse(transaction);
    }

    public TransactionResponse updateTransaction(String transactionId, String userId, UpdateTransactionRequest updateTransactionRequest) {
        Transaction existingTransaction = findTransactionOrThrow(transactionId, userId);
        transactionMapper.updateEntityFromRequest(updateTransactionRequest, existingTransaction);
        existingTransaction.updatedAt = Instant.now();
        transactionRepository.update(existingTransaction);
        return transactionMapper.toResponse(existingTransaction);
    }

    public TransactionResponse updateTransactionStatus(String transactionId, String userId, TransactionStatus newStatus) {
        Transaction existingTransaction = findTransactionOrThrow(transactionId, userId);
        existingTransaction.status = newStatus;
        existingTransaction.paidAt = newStatus == TransactionStatus.PAID ? Instant.now() : null;
        existingTransaction.updatedAt = Instant.now();
        transactionRepository.update(existingTransaction);
        return transactionMapper.toResponse(existingTransaction);
    }

    public void deleteTransaction(String transactionId, String userId) {
        Transaction existingTransaction = findTransactionOrThrow(transactionId, userId);
        transactionRepository.delete(existingTransaction);
    }

    private Transaction findTransactionOrThrow(String transactionId, String userId) {
        return transactionRepository.findByIdAndUserOptional(transactionId, userId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));
    }
}