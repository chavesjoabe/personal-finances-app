package com.family.finances.transaction.controller;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionStatusRequest;
import com.family.finances.transaction.dto.TransactionResponse;
import com.family.finances.transaction.service.TransactionService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/transactions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransactionResource {

    @Inject
    TransactionService transactionService;

    private String getUserId(SecurityContext securityContext) {
        return securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal().getName() : null;
    }

    @POST
    public Response createTransaction(
            @Valid CreateTransactionRequest createTransactionRequest,
            @Context SecurityContext securityContext) {
        TransactionResponse createdTransaction = transactionService.createTransaction(getUserId(securityContext), createTransactionRequest);
        return Response.status(Response.Status.CREATED).entity(createdTransaction).build();
    }

    @PUT
    @Path("/{transactionId}")
    public TransactionResponse updateTransaction(
            @PathParam("transactionId") String transactionId,
            @Valid UpdateTransactionRequest updateTransactionRequest,
            @Context SecurityContext securityContext) {
        return transactionService.updateTransaction(transactionId, getUserId(securityContext), updateTransactionRequest);
    }

    @PATCH
    @Path("/{transactionId}/status")
    public TransactionResponse updateTransactionStatus(
            @PathParam("transactionId") String transactionId,
            @Valid UpdateTransactionStatusRequest updateTransactionStatusRequest,
            @Context SecurityContext securityContext) {
        return transactionService.updateTransactionStatus(transactionId, getUserId(securityContext), updateTransactionStatusRequest.status);
    }

    @DELETE
    @Path("/{transactionId}")
    public Response deleteTransaction(
            @PathParam("transactionId") String transactionId,
            @Context SecurityContext securityContext) {
        transactionService.deleteTransaction(transactionId, getUserId(securityContext));
        return Response.noContent().build();
    }
}