package com.family.finances.transaction.dto;

import java.math.BigDecimal;

public class YearMonthlyDataResponse {

    public int month;
    public String monthName;
    public BigDecimal income = BigDecimal.ZERO;
    public BigDecimal expenses = BigDecimal.ZERO;
    public BigDecimal savings = BigDecimal.ZERO;
    public BigDecimal balance = BigDecimal.ZERO;
    public boolean isPositive;
}