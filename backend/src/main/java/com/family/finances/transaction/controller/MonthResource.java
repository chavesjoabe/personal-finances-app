package com.family.finances.transaction.controller;

import com.family.finances.transaction.dto.MonthVisionResponse;
import com.family.finances.transaction.service.MonthVisionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/months")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MonthResource {

    @Inject
    MonthVisionService monthVisionService;

    private String getUserId(SecurityContext securityContext) {
        return securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal().getName() : null;
    }

    @GET
    @Path("/{year}/{month}")
    public MonthVisionResponse getMonthVision(
            @PathParam("year") int year,
            @PathParam("month") int month,
            @Context SecurityContext securityContext) {
        return monthVisionService.getMonthVision(year, month, getUserId(securityContext));
    }

    @POST
    @Path("/{year}/{month}/repeat-previous")
    public MonthVisionResponse repeatPreviousMonth(
            @PathParam("year") int year,
            @PathParam("month") int month,
            @Context SecurityContext securityContext) {
        return monthVisionService.repeatPreviousMonth(year, month, getUserId(securityContext));
    }
}