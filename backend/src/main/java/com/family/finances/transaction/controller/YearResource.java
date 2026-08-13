package com.family.finances.transaction.controller;

import com.family.finances.transaction.dto.YearSavingsResponse;
import com.family.finances.transaction.dto.YearSummaryResponse;
import com.family.finances.transaction.service.YearSummaryService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/years")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class YearResource {

    @Inject
    YearSummaryService yearSummaryService;

    private String getUserId(SecurityContext securityContext) {
        return securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal().getName() : null;
    }

    @GET
    @Path("/{year}/summary")
    public YearSummaryResponse getYearSummary(
            @PathParam("year") int year,
            @Context SecurityContext securityContext) {
        return yearSummaryService.getYearSummary(year, getUserId(securityContext));
    }

    @GET
    @Path("/{year}/savings")
    public YearSavingsResponse getYearSavings(
            @PathParam("year") int year,
            @Context SecurityContext securityContext) {
        return yearSummaryService.getYearSavings(year, getUserId(securityContext));
    }
}