package com.family.finances.transaction.service;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.TransactionResponse;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.transaction.mapper.TransactionMapper;
import com.family.finances.transaction.repository.TransactionRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Spy
    private TransactionMapper transactionMapper = new TransactionMapper();

    @InjectMocks
    private TransactionService transactionService;

    private Transaction transaction;
    private String userId;

    @BeforeEach
    void setUp() {
        userId = "60d5ec49f1b2c8123456789f";

        transaction = new Transaction();
        transaction.id = new ObjectId("60d5ec49f1b2c8123456789d");
        transaction.userId = new ObjectId(userId);
        transaction.memberId = new ObjectId("60d5ec49f1b2c8123456789a");
        transaction.categoryId = new ObjectId("60d5ec49f1b2c8123456789b");
        transaction.type = TransactionType.EXPENSE;
        transaction.description = "Aluguel";
        transaction.amount = new BigDecimal("2200.00");
        transaction.year = 2026;
        transaction.month = 8;
        transaction.period = Period.FIRST_HALF;
        transaction.status = TransactionStatus.PENDING;
    }

    @Test
    void shouldCreateTransaction() {
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.memberId = "60d5ec49f1b2c8123456789a";
        request.categoryId = "60d5ec49f1b2c8123456789b";
        request.type = TransactionType.EXPENSE;
        request.description = "Aluguel";
        request.amount = new BigDecimal("2200.00");
        request.year = 2026;
        request.month = 8;
        request.period = Period.FIRST_HALF;
        request.status = TransactionStatus.PENDING;

        TransactionResponse response = transactionService.createTransaction(userId, request);

        assertNotNull(response);
        assertEquals("Aluguel", response.description);
        verify(transactionRepository).persist(any(Transaction.class));
    }

    @Test
    void shouldUpdateTransactionStatusToPaid() {
        when(transactionRepository.findByIdAndUserOptional(transaction.id.toHexString(), userId)).thenReturn(Optional.of(transaction));

        TransactionResponse response = transactionService.updateTransactionStatus(transaction.id.toHexString(), userId, TransactionStatus.PAID);

        assertNotNull(response);
        assertEquals(TransactionStatus.PAID, response.status);
        assertNotNull(response.paidAt);
        verify(transactionRepository).update(transaction);
    }
}