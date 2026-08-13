package com.family.finances.user.controller;

import com.family.finances.user.dto.LoginRequest;
import com.family.finances.user.dto.RegisterRequest;
import com.family.finances.user.dto.AuthResponse;
import com.family.finances.user.dto.UserResponse;
import com.family.finances.user.service.AuthService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return Response.status(Response.Status.CREATED).entity(authResponse).build();
    }

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return Response.ok(authResponse).build();
    }

    @GET
    @Path("/me")
    public Response getCurrentUser(@Context SecurityContext securityContext) {
        if (securityContext.getUserPrincipal() == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        String userId = securityContext.getUserPrincipal().getName();
        UserResponse userResponse = authService.getCurrentUser(userId);
        return Response.ok(userResponse).build();
    }
}