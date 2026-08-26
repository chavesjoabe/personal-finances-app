package com.family.finances.transaction.service;

import com.family.finances.transaction.dto.MonthVisionResponse;
import com.family.finances.transaction.dto.MonthVisionSummaryResponse;
import com.family.finances.transaction.dto.PeriodSummaryResponse;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.transaction.mapper.TransactionMapper;
import com.family.finances.transaction.repository.TransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class MonthVisionService {

    @Inject
    TransactionRepository transactionRepository;

    @Inject
    TransactionMapper transactionMapper;

    public MonthVisionResponse getMonthVision(int year, int month, String userId) {
        List<Transaction> monthTransactions = transactionRepository.findByYearAndMonthAndUser(year, month, userId);

        PeriodSummaryResponse firstHalf = buildPeriodSummary(monthTransactions, Period.FIRST_HALF);
        PeriodSummaryResponse secondHalf = buildPeriodSummary(monthTransactions, Period.SECOND_HALF);

        MonthVisionSummaryResponse summary = buildMonthSummary(monthTransactions, firstHalf, secondHalf);

        MonthVisionResponse response = new MonthVisionResponse();
        response.year = year;
        response.month = month;
        response.firstHalf = firstHalf;
        response.secondHalf = secondHalf;
        response.summary = summary;
        response.isEmpty = monthTransactions.isEmpty();

        return response;
    }

    public MonthVisionResponse repeatPreviousMonth(int year, int month, String userId) {
        int previousMonth = month == 1 ? 12 : month - 1;
        int previousYear = month == 1 ? year - 1 : year;

        List<Transaction> previousMonthTransactions = transactionRepository.findByYearAndMonthAndUser(previousYear, previousMonth, userId);

        previousMonthTransactions.stream()
                .filter(transaction -> transaction.type != TransactionType.SAVINGS)
                .forEach(originalTransaction -> copyTransactionToMonth(originalTransaction, year, month, userId));

        return getMonthVision(year, month, userId);
    }

    private void copyTransactionToMonth(Transaction originalTransaction, int targetYear, int targetMonth, String userId) {
        Transaction copiedTransaction = new Transaction();
        if (userId != null) {
            copiedTransaction.userId = new ObjectId(userId);
        }
        copiedTransaction.memberId = originalTransaction.memberId;
        copiedTransaction.categoryId = originalTransaction.categoryId;
        copiedTransaction.type = originalTransaction.type;
        copiedTransaction.description = originalTransaction.description;
        copiedTransaction.amount = originalTransaction.amount;
        copiedTransaction.year = targetYear;
        copiedTransaction.month = targetMonth;
        copiedTransaction.period = originalTransaction.period;
        copiedTransaction.status = TransactionStatus.PENDING;
        copiedTransaction.paidAt = null;
        copiedTransaction.copiedFrom = originalTransaction.id;
        copiedTransaction.createdAt = Instant.now();
        copiedTransaction.updatedAt = Instant.now();

        transactionRepository.persist(copiedTransaction);
    }

    private PeriodSummaryResponse buildPeriodSummary(List<Transaction> monthTransactions, Period period) {
        List<Transaction> periodTransactions = monthTransactions.stream()
                .filter(transaction -> transaction.period == period)
                .toList();

        List<Transaction> incomes = filterByType(periodTransactions, TransactionType.INCOME);
        List<Transaction> expenses = filterByType(periodTransactions, TransactionType.EXPENSE);
        List<Transaction> savings = filterByType(periodTransactions, TransactionType.SAVINGS);

        BigDecimal totalIncome = calculateTotal(incomes);
        BigDecimal totalExpense = calculateTotal(expenses);
        BigDecimal totalSavings = calculateTotal(savings);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        BigDecimal balanceMinusSavings = balance.subtract(totalSavings);

        PeriodSummaryResponse periodSummary = new PeriodSummaryResponse();
        periodSummary.period = period;
        periodSummary.incomes = transactionMapper.toResponseList(incomes);
        periodSummary.expenses = transactionMapper.toResponseList(expenses);
        periodSummary.savings = transactionMapper.toResponseList(savings);
        periodSummary.totalIncome = totalIncome;
        periodSummary.totalExpense = totalExpense;
        periodSummary.totalSavings = totalSavings;
        periodSummary.balance = balance;
        periodSummary.balanceMinusSavings = balanceMinusSavings;

        return periodSummary;
    }

    private MonthVisionSummaryResponse buildMonthSummary(List<Transaction> monthTransactions,
                                                         PeriodSummaryResponse firstHalf,
                                                         PeriodSummaryResponse secondHalf) {
        BigDecimal totalIncome = firstHalf.totalIncome.add(secondHalf.totalIncome);
        BigDecimal totalExpenses = firstHalf.totalExpense.add(secondHalf.totalExpense);
        BigDecimal totalSavings = firstHalf.totalSavings.add(secondHalf.totalSavings);
        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<Transaction> pendingExpenses = monthTransactions.stream()
                .filter(tx -> tx.type == TransactionType.EXPENSE && tx.status == TransactionStatus.PENDING)
                .toList();

        long pendingCount = pendingExpenses.size();
        BigDecimal pendingAmount = calculateTotal(pendingExpenses);

        MonthVisionSummaryResponse summary = new MonthVisionSummaryResponse();
        summary.totalIncome = totalIncome;
        summary.totalExpenses = totalExpenses;
        summary.totalSavings = totalSavings;
        summary.netBalance = netBalance;
        summary.pendingCount = pendingCount;
        summary.pendingAmount = pendingAmount;

        return summary;
    }

    private List<Transaction> filterByType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(transaction -> transaction.type == type)
                .toList();
    }

    private BigDecimal calculateTotal(List<Transaction> transactions) {
        return transactions.stream()
                .map(transaction -> transaction.amount != null ? transaction.amount : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}