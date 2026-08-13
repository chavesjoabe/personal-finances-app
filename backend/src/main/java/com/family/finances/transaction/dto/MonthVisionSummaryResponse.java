package com.family.finances.transaction.dto;

import java.math.BigDecimal;

public class MonthVisionSummaryResponse {

    public BigDecimal totalIncome = BigDecimal.ZERO;
    public BigDecimal totalExpenses = BigDecimal.ZERO;
    public BigDecimal totalSavings = BigDecimal.ZERO;
    public BigDecimal netBalance = BigDecimal.ZERO;
    public long pendingCount = 0;
    public BigDecimal pendingAmount = BigDecimal.ZERO;
}