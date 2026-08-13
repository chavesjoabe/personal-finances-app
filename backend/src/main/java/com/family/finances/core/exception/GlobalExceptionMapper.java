package com.family.finances.core.exception;

import com.family.finances.category.exception.CategoryNotFoundException;
import com.family.finances.member.exception.MemberNotFoundException;
import com.family.finances.transaction.exception.TransactionNotFoundException;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException exception) {
        if (exception instanceof TransactionNotFoundException ||
            exception instanceof CategoryNotFoundException ||
            exception instanceof MemberNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(exception.getMessage()))
                    .build();
        }

        if (exception instanceof InvalidOperationException ||
            exception instanceof IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(exception.getMessage()))
                    .build();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ErrorResponse("Unexpected error occurred: " + exception.getMessage()))
                .build();
    }

    public record ErrorResponse(String message) {
    }
}