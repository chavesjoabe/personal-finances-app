package com.family.finances.transaction.dto;

import java.util.ArrayList;
import java.util.List;

public class YearSummaryResponse {

    public int year;
    public CoupleSummaryResponse couple;
    public List<YearMemberSummaryResponse> members = new ArrayList<>();
    public List<YearMonthlyDataResponse> monthlyData = new ArrayList<>();
}