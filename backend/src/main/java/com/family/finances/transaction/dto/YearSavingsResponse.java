package com.family.finances.transaction.dto;

import com.family.finances.member.dto.MemberResponse;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class YearSavingsResponse {

    public int year;
    public List<MemberResponse> members = new ArrayList<>();
    public BigDecimal totalSavingsYear = BigDecimal.ZERO;
    public List<MonthlySavingsResponse> monthlySavings = new ArrayList<>();
}