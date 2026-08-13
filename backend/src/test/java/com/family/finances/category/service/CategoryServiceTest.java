package com.family.finances.category.service;

import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.category.entity.Category;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.category.mapper.CategoryMapper;
import com.family.finances.category.repository.CategoryRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Spy
    private CategoryMapper categoryMapper = new CategoryMapper();

    @InjectMocks
    private CategoryService categoryService;

    private Category systemCategory;
    private Category customCategory;
    private String userId;

    @BeforeEach
    void setUp() {
        userId = "60d5ec49f1b2c8123456789f";

        systemCategory = new Category();
        systemCategory.id = new ObjectId("60d5ec49f1b2c8123456789b");
        systemCategory.userId = new ObjectId(userId);
        systemCategory.name = "Salário";
        systemCategory.type = TransactionType.INCOME;
        systemCategory.isSystem = true;
        systemCategory.active = true;

        customCategory = new Category();
        customCategory.id = new ObjectId("60d5ec49f1b2c8123456789c");
        customCategory.userId = new ObjectId(userId);
        customCategory.name = "Academia";
        customCategory.type = TransactionType.EXPENSE;
        customCategory.isSystem = false;
        customCategory.active = true;
    }

    @Test
    void shouldReturnCategoriesFilteredByType() {
        when(categoryRepository.findByTypeAndUser(TransactionType.INCOME, userId)).thenReturn(List.of(systemCategory));

        List<CategoryResponse> result = categoryService.getCategories(TransactionType.INCOME, userId);

        assertEquals(1, result.size());
        assertEquals("Salário", result.get(0).name);
    }

    @Test
    void shouldNotAllowDeletingSystemCategory() {
        when(categoryRepository.findByIdAndUserOptional(systemCategory.id.toHexString(), userId)).thenReturn(Optional.of(systemCategory));

        assertThrows(InvalidOperationException.class, () ->
                categoryService.deleteCategory(systemCategory.id.toHexString(), userId));
    }

    @Test
    void shouldDeactivateCustomCategoryOnDelete() {
        when(categoryRepository.findByIdAndUserOptional(customCategory.id.toHexString(), userId)).thenReturn(Optional.of(customCategory));

        categoryService.deleteCategory(customCategory.id.toHexString(), userId);

        assertFalse(customCategory.active);
        verify(categoryRepository).update(customCategory);
    }
}