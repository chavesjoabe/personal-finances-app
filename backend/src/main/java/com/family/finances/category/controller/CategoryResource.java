package com.family.finances.category.controller;

import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.dto.UpdateCategoryRequest;
import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.category.service.CategoryService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/api/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryResource {

    @Inject
    CategoryService categoryService;

    private String getUserId(SecurityContext securityContext) {
        return securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal().getName() : null;
    }

    @GET
    public List<CategoryResponse> getCategories(
            @QueryParam("type") TransactionType type,
            @Context SecurityContext securityContext) {
        return categoryService.getCategories(type, getUserId(securityContext));
    }

    @GET
    @Path("/{categoryId}")
    public CategoryResponse getCategoryById(
            @PathParam("categoryId") String categoryId,
            @Context SecurityContext securityContext) {
        return categoryService.getCategoryById(categoryId, getUserId(securityContext));
    }

    @POST
    public Response createCategory(
            @Valid CreateCategoryRequest createCategoryRequest,
            @Context SecurityContext securityContext) {
        CategoryResponse category = categoryService.createCategory(getUserId(securityContext), createCategoryRequest);
        return Response.status(Response.Status.CREATED).entity(category).build();
    }

    @PUT
    @Path("/{categoryId}")
    public CategoryResponse updateCategory(
            @PathParam("categoryId") String categoryId,
            @Valid UpdateCategoryRequest updateCategoryRequest,
            @Context SecurityContext securityContext) {
        return categoryService.updateCategory(categoryId, getUserId(securityContext), updateCategoryRequest);
    }

    @DELETE
    @Path("/{categoryId}")
    public Response deleteCategory(
            @PathParam("categoryId") String categoryId,
            @Context SecurityContext securityContext) {
        categoryService.deleteCategory(categoryId, getUserId(securityContext));
        return Response.noContent().build();
    }
}