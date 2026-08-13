package com.family.finances.category.exception;

import com.family.finances.category.entity.Category;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(String categoryId) {
        super("Category not found: " + categoryId);
    }
}