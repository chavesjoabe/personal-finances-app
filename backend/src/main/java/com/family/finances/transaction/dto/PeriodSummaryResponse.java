package com.family.finances.transaction.dto;

import com.family.finances.transaction.entity.Period;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PeriodSummaryResponse {

    public Period period;
    public List<TransactionResponse> incomes = new ArrayList<>();
    public List<TransactionResponse> expenses = new ArrayList<>();
    public List<TransactionResponse> savings = new ArrayList<>();
    public BigDecimal totalIncome = BigDecimal.ZERO;
    public BigDecimal totalExpense = BigDecimal.ZERO;
    public BigDecimal totalSavings = BigDecimal.ZERO;
    public BigDecimal balance = BigDecimal.ZERO;
}