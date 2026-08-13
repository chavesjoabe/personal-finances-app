package com.family.finances.transaction.dto;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class MonthlySavingsResponse {

    public int month;
    public String monthName;
    public Map<String, BigDecimal> perMember = new HashMap<>();
    public BigDecimal monthTotal = BigDecimal.ZERO;
    public BigDecimal accumulatedTotal = BigDecimal.ZERO;
}