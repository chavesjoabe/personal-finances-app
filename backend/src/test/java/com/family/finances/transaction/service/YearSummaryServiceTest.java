package com.family.finances.transaction.service;

import com.family.finances.transaction.dto.YearSavingsResponse;
import com.family.finances.transaction.dto.YearSummaryResponse;
import com.family.finances.member.entity.Member;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.member.mapper.MemberMapper;
import com.family.finances.member.repository.MemberRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class YearSummaryServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private MemberRepository memberRepository;

    @Spy
    private MemberMapper memberMapper = new MemberMapper();

    @InjectMocks
    private YearSummaryService yearSummaryService;

    private Member member;
    private Transaction incomeTx;
    private Transaction expenseTx;
    private Transaction savingsTx;
    private String userId;

    @BeforeEach
    void setUp() {
        userId = "60d5ec49f1b2c8123456789f";

        member = new Member();
        member.id = new ObjectId("60d5ec49f1b2c8123456789a");
        member.userId = new ObjectId(userId);
        member.name = "Joabe";
        member.color = "#1976D2";
        member.active = true;

        incomeTx = new Transaction();
        incomeTx.id = new ObjectId();
        incomeTx.userId = new ObjectId(userId);
        incomeTx.memberId = member.id;
        incomeTx.type = TransactionType.INCOME;
        incomeTx.amount = new BigDecimal("4000.00");
        incomeTx.year = 2026;
        incomeTx.month = 1;
        incomeTx.period = Period.FIRST_HALF;
        incomeTx.status = TransactionStatus.PAID;

        expenseTx = new Transaction();
        expenseTx.id = new ObjectId();
        expenseTx.userId = new ObjectId(userId);
        expenseTx.memberId = member.id;
        expenseTx.type = TransactionType.EXPENSE;
        expenseTx.amount = new BigDecimal("1500.00");
        expenseTx.year = 2026;
        expenseTx.month = 1;
        expenseTx.period = Period.FIRST_HALF;
        expenseTx.status = TransactionStatus.PAID;

        savingsTx = new Transaction();
        savingsTx.id = new ObjectId();
        savingsTx.userId = new ObjectId(userId);
        savingsTx.memberId = member.id;
        savingsTx.type = TransactionType.SAVINGS;
        savingsTx.amount = new BigDecimal("500.00");
        savingsTx.year = 2026;
        savingsTx.month = 1;
        savingsTx.period = Period.FIRST_HALF;
        savingsTx.status = TransactionStatus.PAID;
    }

    @Test
    void shouldCalculateYearSummary() {
        when(memberRepository.findAllActiveByUser(userId)).thenReturn(List.of(member));
        when(transactionRepository.findByYearAndUser(2026, userId)).thenReturn(List.of(incomeTx, expenseTx, savingsTx));

        YearSummaryResponse response = yearSummaryService.getYearSummary(2026, userId);

        assertNotNull(response);
        assertEquals(2026, response.year);

        assertEquals(new BigDecimal("4000.00"), response.couple.grossIncome);
        assertEquals(new BigDecimal("1500.00"), response.couple.totalExpenses);
        assertEquals(new BigDecimal("500.00"), response.couple.totalSavings);
        assertEquals(new BigDecimal("2500.00"), response.couple.netBalance);

        assertEquals(1, response.members.size());
        assertEquals("Joabe", response.members.get(0).memberName);

        assertEquals(12, response.monthlyData.size());
        assertEquals("Janeiro", response.monthlyData.get(0).monthName);
        assertEquals(new BigDecimal("4000.00"), response.monthlyData.get(0).income);
    }

    @Test
    void shouldCalculateYearSavings() {
        when(memberRepository.findAllActiveByUser(userId)).thenReturn(List.of(member));
        when(transactionRepository.findByYearAndUser(2026, userId)).thenReturn(List.of(savingsTx));

        YearSavingsResponse response = yearSummaryService.getYearSavings(2026, userId);

        assertNotNull(response);
        assertEquals(2026, response.year);
        assertEquals(new BigDecimal("500.00"), response.totalSavingsYear);
        assertEquals(12, response.monthlySavings.size());
        assertEquals(new BigDecimal("500.00"), response.monthlySavings.get(0).monthTotal);
        assertEquals(new BigDecimal("500.00"), response.monthlySavings.get(0).accumulatedTotal);
    }
}