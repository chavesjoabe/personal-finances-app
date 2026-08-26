package com.family.finances.transaction.service;

import com.family.finances.transaction.dto.MonthVisionResponse;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MonthVisionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Spy
    private TransactionMapper transactionMapper = new TransactionMapper();

    @InjectMocks
    private MonthVisionService monthVisionService;

    private Transaction incomeTx;
    private Transaction expenseTx;
    private Transaction savingsTx;
    private String userId;

    @BeforeEach
    void setUp() {
        userId = "60d5ec49f1b2c8123456789f";
        ObjectId memberId = new ObjectId("60d5ec49f1b2c8123456789a");
        ObjectId categoryId = new ObjectId("60d5ec49f1b2c8123456789b");

        incomeTx = new Transaction();
        incomeTx.id = new ObjectId();
        incomeTx.userId = new ObjectId(userId);
        incomeTx.memberId = memberId;
        incomeTx.categoryId = categoryId;
        incomeTx.type = TransactionType.INCOME;
        incomeTx.amount = new BigDecimal("3500.00");
        incomeTx.year = 2026;
        incomeTx.month = 8;
        incomeTx.period = Period.FIRST_HALF;
        incomeTx.status = TransactionStatus.PAID;

        expenseTx = new Transaction();
        expenseTx.id = new ObjectId();
        expenseTx.userId = new ObjectId(userId);
        expenseTx.memberId = memberId;
        expenseTx.categoryId = categoryId;
        expenseTx.type = TransactionType.EXPENSE;
        expenseTx.amount = new BigDecimal("1200.00");
        expenseTx.year = 2026;
        expenseTx.month = 8;
        expenseTx.period = Period.FIRST_HALF;
        expenseTx.status = TransactionStatus.PENDING;

        savingsTx = new Transaction();
        savingsTx.id = new ObjectId();
        savingsTx.userId = new ObjectId(userId);
        savingsTx.memberId = memberId;
        savingsTx.categoryId = categoryId;
        savingsTx.type = TransactionType.SAVINGS;
        savingsTx.amount = new BigDecimal("500.00");
        savingsTx.year = 2026;
        savingsTx.month = 8;
        savingsTx.period = Period.SECOND_HALF;
        savingsTx.status = TransactionStatus.PAID;
    }

    @Test
    void shouldCalculateMonthVisionCorrectly() {
        when(transactionRepository.findByYearAndMonthAndUser(2026, 8, userId))
                .thenReturn(List.of(incomeTx, expenseTx, savingsTx));

        MonthVisionResponse response = monthVisionService.getMonthVision(2026, 8, userId);

        assertNotNull(response);
        assertEquals(2026, response.year);
        assertEquals(8, response.month);
        assertFalse(response.isEmpty);

        assertEquals(new BigDecimal("3500.00"), response.firstHalf.totalIncome);
        assertEquals(new BigDecimal("1200.00"), response.firstHalf.totalExpense);
        assertEquals(new BigDecimal("2300.00"), response.firstHalf.balance);
        assertEquals(new BigDecimal("2300.00"), response.firstHalf.balanceMinusSavings);

        assertEquals(new BigDecimal("500.00"), response.secondHalf.totalSavings);
        assertEquals(new BigDecimal("0"), response.secondHalf.balance);
        assertEquals(new BigDecimal("-500.00"), response.secondHalf.balanceMinusSavings);

        assertEquals(new BigDecimal("3500.00"), response.summary.totalIncome);
        assertEquals(new BigDecimal("1200.00"), response.summary.totalExpenses);
        assertEquals(new BigDecimal("500.00"), response.summary.totalSavings);
        assertEquals(new BigDecimal("2300.00"), response.summary.netBalance);
        assertEquals(1, response.summary.pendingCount);
        assertEquals(new BigDecimal("1200.00"), response.summary.pendingAmount);
    }

    @Test
    void shouldRepeatPreviousMonthExcludingSavings() {
        when(transactionRepository.findByYearAndMonthAndUser(2026, 7, userId))
                .thenReturn(List.of(incomeTx, expenseTx, savingsTx));
        when(transactionRepository.findByYearAndMonthAndUser(2026, 8, userId))
                .thenReturn(List.of());

        monthVisionService.repeatPreviousMonth(2026, 8, userId);

        verify(transactionRepository, times(2)).persist(any(Transaction.class));
    }
}