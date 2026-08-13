package com.family.finances.category.mapper;

import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.category.entity.Category;
import com.family.finances.transaction.entity.TransactionType;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CategoryMapperTest {

    private CategoryMapper categoryMapper;

    @BeforeEach
    void setUp() {
        categoryMapper = new CategoryMapper();
    }

    @Test
    void shouldMapCreateRequestToEntity() {
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.name = "Salário";
        request.type = TransactionType.INCOME;
        request.color = "#4CAF50";

        Category category = categoryMapper.toEntity(request);

        assertNotNull(category);
        assertEquals("Salário", category.name);
        assertEquals(TransactionType.INCOME, category.type);
        assertEquals("#4CAF50", category.color);
        assertFalse(category.isSystem);
        assertTrue(category.active);
    }

    @Test
    void shouldMapEntityToResponse() {
        Category category = new Category();
        category.id = new ObjectId("60d5ec49f1b2c8123456789b");
        category.name = "Cartão de Crédito";
        category.type = TransactionType.EXPENSE;
        category.color = "#ED7D31";
        category.isSystem = true;
        category.active = true;

        CategoryResponse response = categoryMapper.toResponse(category);

        assertNotNull(response);
        assertEquals("60d5ec49f1b2c8123456789b", response.id);
        assertEquals("60d5ec49f1b2c8123456789b", response.getUnderscoreId());
        assertEquals("Cartão de Crédito", response.name);
        assertEquals(TransactionType.EXPENSE, response.type);
        assertTrue(response.isSystem);
    }
}