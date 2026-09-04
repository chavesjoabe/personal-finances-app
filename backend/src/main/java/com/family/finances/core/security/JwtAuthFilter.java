package com.family.finances.core.security;

import io.jsonwebtoken.Claims;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.security.Principal;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class JwtAuthFilter implements ContainerRequestFilter {

    @Inject
    JwtTokenProvider jwtTokenProvider;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod();

        // Allow CORS OPTIONS preflight requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return;
        }

        // Public endpoints that do not require JWT authentication
        if (isPublicPath(path)) {
            return;
        }

        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abortWithUnauthorized(requestContext, "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring("Bearer ".length()).trim();
        Claims claims = jwtTokenProvider.validateAndExtractClaims(token);

        if (claims == null) {
            abortWithUnauthorized(requestContext, "Invalid or expired JWT token");
            return;
        }

        final String userId = claims.getSubject();
        final SecurityContext currentSecurityContext = requestContext.getSecurityContext();

        requestContext.setSecurityContext(new SecurityContext() {
            @Override
            public Principal getUserPrincipal() {
                return () -> userId;
            }

            @Override
            public boolean isUserInRole(String role) {
                return true;
            }

            @Override
            public boolean isSecure() {
                return currentSecurityContext.isSecure();
            }

            @Override
            public String getAuthenticationScheme() {
                return "Bearer";
            }
        });
    }

    private boolean isPublicPath(String path) {
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        return path.equals("api/auth/login") ||
               path.equals("api/auth/register") ||
               path.equals("api/health") ||
               path.startsWith("api/health/") ||
               path.equals("health") ||
               path.startsWith("health/") ||
               path.startsWith("q/openapi") ||
               path.startsWith("q/swagger-ui");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorResponse(message))
                        .header(HttpHeaders.CONTENT_TYPE, "application/json")
                        .build()
        );
    }

    public record ErrorResponse(String message) {
    }
}