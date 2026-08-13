package com.family.finances.transaction.mapper;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.TransactionResponse;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class TransactionMapperTest {

    private TransactionMapper transactionMapper;

    @BeforeEach
    void setUp() {
        transactionMapper = new TransactionMapper();
    }

    @Test
    void shouldMapCreateRequestToEntity() {
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

        Transaction transaction = transactionMapper.toEntity(request);

        assertNotNull(transaction);
        assertEquals(new ObjectId("60d5ec49f1b2c8123456789a"), transaction.memberId);
        assertEquals(new ObjectId("60d5ec49f1b2c8123456789b"), transaction.categoryId);
        assertEquals(TransactionType.EXPENSE, transaction.type);
        assertEquals("Aluguel", transaction.description);
        assertEquals(new BigDecimal("2200.00"), transaction.amount);
        assertEquals(2026, transaction.year);
        assertEquals(8, transaction.month);
        assertEquals(Period.FIRST_HALF, transaction.period);
        assertEquals(TransactionStatus.PENDING, transaction.status);
        assertNull(transaction.paidAt);
    }

    @Test
    void shouldMapEntityToResponse() {
        Transaction transaction = new Transaction();
        transaction.id = new ObjectId("60d5ec49f1b2c8123456789c");
        transaction.memberId = new ObjectId("60d5ec49f1b2c8123456789a");
        transaction.categoryId = new ObjectId("60d5ec49f1b2c8123456789b");
        transaction.type = TransactionType.INCOME;
        transaction.description = "Salário";
        transaction.amount = new BigDecimal("3500.00");
        transaction.year = 2026;
        transaction.month = 8;
        transaction.period = Period.FIRST_HALF;
        transaction.status = TransactionStatus.PAID;
        transaction.paidAt = Instant.parse("2026-08-05T10:00:00Z");

        TransactionResponse response = transactionMapper.toResponse(transaction);

        assertNotNull(response);
        assertEquals("60d5ec49f1b2c8123456789c", response.id);
        assertEquals("60d5ec49f1b2c8123456789c", response.getUnderscoreId());
        assertEquals("60d5ec49f1b2c8123456789a", response.memberId);
        assertEquals("60d5ec49f1b2c8123456789b", response.categoryId);
        assertEquals(TransactionType.INCOME, response.type);
        assertEquals("Salário", response.description);
        assertEquals(new BigDecimal("3500.00"), response.amount);
        assertEquals(TransactionStatus.PAID, response.status);
        assertEquals("2026-08-05T10:00:00Z", response.paidAt);
    }
}