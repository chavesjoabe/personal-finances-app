package com.family.finances.category.mapper;

import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.dto.UpdateCategoryRequest;
import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.category.entity.Category;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CategoryMapper {

    public Category toEntity(CreateCategoryRequest request) {
        Category category = new Category();
        category.name = request.name;
        category.type = request.type;
        category.color = request.color != null && !request.color.isBlank() ? request.color : "#5B9BD5";
        category.isSystem = false;
        category.active = true;
        return category;
    }

    public void updateEntityFromRequest(UpdateCategoryRequest request, Category category) {
        if (request.name != null && !request.name.isBlank()) {
            category.name = request.name;
        }
        if (request.type != null) {
            category.type = request.type;
        }
        if (request.color != null && !request.color.isBlank()) {
            category.color = request.color;
        }
        if (request.active != null) {
            category.active = request.active;
        }
    }

    public CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.id = category.id != null ? category.id.toHexString() : null;
        response.name = category.name;
        response.type = category.type;
        response.color = category.color;
        response.isSystem = category.isSystem;
        response.active = category.active;
        return response;
    }

    public List<CategoryResponse> toResponseList(List<Category> categories) {
        return categories.stream().map(this::toResponse).toList();
    }
}