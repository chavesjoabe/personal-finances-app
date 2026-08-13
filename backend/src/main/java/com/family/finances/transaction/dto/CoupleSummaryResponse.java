package com.family.finances.transaction.dto;

import java.math.BigDecimal;

public class CoupleSummaryResponse {

    public BigDecimal grossIncome = BigDecimal.ZERO;
    public BigDecimal totalExpenses = BigDecimal.ZERO;
    public BigDecimal totalSavings = BigDecimal.ZERO;
    public BigDecimal netBalance = BigDecimal.ZERO;
}