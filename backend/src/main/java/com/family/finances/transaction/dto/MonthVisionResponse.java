package com.family.finances.transaction.dto;

public class MonthVisionResponse {

    public int year;
    public int month;
    public PeriodSummaryResponse firstHalf;
    public PeriodSummaryResponse secondHalf;
    public MonthVisionSummaryResponse summary;
    public boolean isEmpty;
}