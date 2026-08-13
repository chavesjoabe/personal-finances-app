package com.family.finances.category.service;

import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.dto.UpdateCategoryRequest;
import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.category.entity.Category;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.category.exception.CategoryNotFoundException;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.category.mapper.CategoryMapper;
import com.family.finances.category.repository.CategoryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.List;

@ApplicationScoped
public class CategoryService {

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    CategoryMapper categoryMapper;

    public List<CategoryResponse> getCategories(TransactionType type, String userId) {
        List<Category> categories;
        if (type != null) {
            categories = categoryRepository.findByTypeAndUser(type, userId);
        } else {
            categories = categoryRepository.findAllActiveByUser(userId);
        }
        return categoryMapper.toResponseList(categories);
    }

    public CategoryResponse getCategoryById(String categoryId, String userId) {
        Category category = findCategoryOrThrow(categoryId, userId);
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse createCategory(String userId, CreateCategoryRequest createCategoryRequest) {
        Category category = categoryMapper.toEntity(createCategoryRequest);
        if (userId != null) {
            category.userId = new ObjectId(userId);
        }
        categoryRepository.persist(category);
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse updateCategory(String categoryId, String userId, UpdateCategoryRequest updateCategoryRequest) {
        Category category = findCategoryOrThrow(categoryId, userId);
        categoryMapper.updateEntityFromRequest(updateCategoryRequest, category);
        categoryRepository.update(category);
        return categoryMapper.toResponse(category);
    }

    public void deleteCategory(String categoryId, String userId) {
        Category category = findCategoryOrThrow(categoryId, userId);
        if (category.isSystem) {
            throw new InvalidOperationException("System categories cannot be deleted.");
        }
        category.active = false;
        categoryRepository.update(category);
    }

    private Category findCategoryOrThrow(String categoryId, String userId) {
        return categoryRepository.findByIdAndUserOptional(categoryId, userId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));
    }
}