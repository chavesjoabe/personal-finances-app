package com.family.finances.transaction.service;

import com.family.finances.member.dto.MemberResponse;
import com.family.finances.transaction.dto.CoupleSummaryResponse;
import com.family.finances.transaction.dto.MonthlySavingsResponse;
import com.family.finances.transaction.dto.YearMemberSummaryResponse;
import com.family.finances.transaction.dto.YearMonthlyDataResponse;
import com.family.finances.transaction.dto.YearSavingsResponse;
import com.family.finances.transaction.dto.YearSummaryResponse;

import com.family.finances.member.entity.Member;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.member.mapper.MemberMapper;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.transaction.repository.TransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.util.*;

@ApplicationScoped
public class YearSummaryService {

    private static final String[] MONTH_NAMES = {
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    };

    @Inject
    TransactionRepository transactionRepository;

    @Inject
    MemberRepository memberRepository;

    @Inject
    MemberMapper memberMapper;

    public YearSummaryResponse getYearSummary(int year, String userId) {
        List<Transaction> yearTransactions = transactionRepository.findByYearAndUser(year, userId);
        List<Member> activeMembers = memberRepository.findAllActiveByUser(userId);

        List<YearMemberSummaryResponse> memberSummaries = activeMembers.stream().map(member -> {
            String memberIdStr = member.id != null ? member.id.toHexString() : "";
            List<Transaction> memberTransactions = yearTransactions.stream()
                    .filter(tx -> tx.memberId != null && tx.memberId.toHexString().equals(memberIdStr))
                    .toList();

            BigDecimal grossIncome = calculateSumForType(memberTransactions, TransactionType.INCOME);
            BigDecimal totalExpenses = calculateSumForType(memberTransactions, TransactionType.EXPENSE);
            BigDecimal totalSavings = calculateSumForType(memberTransactions, TransactionType.SAVINGS);

            YearMemberSummaryResponse summary = new YearMemberSummaryResponse();
            summary.memberId = memberIdStr;
            summary.memberName = member.name;
            summary.memberColor = member.color;
            summary.grossIncome = grossIncome;
            summary.totalExpenses = totalExpenses;
            summary.totalSavings = totalSavings;
            summary.netBalance = grossIncome.subtract(totalExpenses);
            return summary;
        }).toList();

        BigDecimal coupleGross = calculateSumForType(yearTransactions, TransactionType.INCOME);
        BigDecimal coupleExpenses = calculateSumForType(yearTransactions, TransactionType.EXPENSE);
        BigDecimal coupleSavings = calculateSumForType(yearTransactions, TransactionType.SAVINGS);

        CoupleSummaryResponse coupleSummary = new CoupleSummaryResponse();
        coupleSummary.grossIncome = coupleGross;
        coupleSummary.totalExpenses = coupleExpenses;
        coupleSummary.totalSavings = coupleSavings;
        coupleSummary.netBalance = coupleGross.subtract(coupleExpenses);

        List<YearMonthlyDataResponse> monthlyDataList = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            int currentMonth = month;
            List<Transaction> monthTransactions = yearTransactions.stream()
                    .filter(tx -> tx.month == currentMonth)
                    .toList();

            BigDecimal income = calculateSumForType(monthTransactions, TransactionType.INCOME);
            BigDecimal expenses = calculateSumForType(monthTransactions, TransactionType.EXPENSE);
            BigDecimal savings = calculateSumForType(monthTransactions, TransactionType.SAVINGS);
            BigDecimal balance = income.subtract(expenses);

            YearMonthlyDataResponse monthData = new YearMonthlyDataResponse();
            monthData.month = month;
            monthData.monthName = MONTH_NAMES[month - 1];
            monthData.income = income;
            monthData.expenses = expenses;
            monthData.savings = savings;
            monthData.balance = balance;
            monthData.isPositive = balance.compareTo(BigDecimal.ZERO) >= 0;

            monthlyDataList.add(monthData);
        }

        YearSummaryResponse response = new YearSummaryResponse();
        response.year = year;
        response.couple = coupleSummary;
        response.members = memberSummaries;
        response.monthlyData = monthlyDataList;

        return response;
    }

    public YearSavingsResponse getYearSavings(int year, String userId) {
        List<Transaction> yearSavingsTransactions = transactionRepository.findByYearAndUser(year, userId).stream()
                .filter(tx -> tx.type == TransactionType.SAVINGS)
                .toList();

        List<Member> activeMembers = memberRepository.findAllActiveByUser(userId);
        List<MemberResponse> memberResponses = memberMapper.toResponseList(activeMembers);

        BigDecimal accumulatedTotal = BigDecimal.ZERO;
        List<MonthlySavingsResponse> monthlySavingsList = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            int currentMonth = month;
            List<Transaction> monthSavings = yearSavingsTransactions.stream()
                    .filter(tx -> tx.month == currentMonth)
                    .toList();

            Map<String, BigDecimal> perMember = new HashMap<>();
            BigDecimal monthTotal = BigDecimal.ZERO;

            for (Member member : activeMembers) {
                String memberIdStr = member.id != null ? member.id.toHexString() : "";
                BigDecimal memberAmount = monthSavings.stream()
                        .filter(tx -> tx.memberId != null && tx.memberId.toHexString().equals(memberIdStr))
                        .map(tx -> tx.amount != null ? tx.amount : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                perMember.put(memberIdStr, memberAmount);
                monthTotal = monthTotal.add(memberAmount);
            }

            accumulatedTotal = accumulatedTotal.add(monthTotal);

            MonthlySavingsResponse monthlySavings = new MonthlySavingsResponse();
            monthlySavings.month = month;
            monthlySavings.monthName = MONTH_NAMES[month - 1];
            monthlySavings.perMember = perMember;
            monthlySavings.monthTotal = monthTotal;
            monthlySavings.accumulatedTotal = accumulatedTotal;

            monthlySavingsList.add(monthlySavings);
        }

        YearSavingsResponse response = new YearSavingsResponse();
        response.year = year;
        response.members = memberResponses;
        response.totalSavingsYear = accumulatedTotal;
        response.monthlySavings = monthlySavingsList;

        return response;
    }

    private BigDecimal calculateSumForType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(tx -> tx.type == type)
                .map(tx -> tx.amount != null ? tx.amount : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}