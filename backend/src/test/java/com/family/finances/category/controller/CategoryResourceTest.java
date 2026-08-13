package com.family.finances.category.controller;

import com.family.finances.user.entity.User;

import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.entity.Category;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.core.security.JwtTokenProvider;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@QuarkusTest
class CategoryResourceTest {

    @InjectMock
    CategoryRepository categoryRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private String validToken;
    private Category category;

    @BeforeEach
    void setUp() {
        validToken = jwtTokenProvider.generateToken("60d5ec49f1b2c8123456789f", "test@test.com", "Test User");

        category = new Category();
        category.id = new ObjectId("60d5ec49f1b2c8123456789b");
        category.userId = new ObjectId("60d5ec49f1b2c8123456789f");
        category.name = "Salário";
        category.type = TransactionType.INCOME;
        category.color = "#4CAF50";
        category.isSystem = true;
        category.active = true;
    }

    @Test
    void shouldGetCategories() {
        when(categoryRepository.findAllActiveByUser(any())).thenReturn(List.of(category));

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/categories")
                .then()
                .statusCode(200)
                .body("[0].name", is("Salário"))
                .body("[0].type", is("INCOME"));
    }

    @Test
    void shouldCreateCategory() {
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.name = "Bônus";
        request.type = TransactionType.INCOME;
        request.color = "#00BCD4";

        given()
                .header("Authorization", "Bearer " + validToken)
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/categories")
                .then()
                .statusCode(201)
                .body("name", is("Bônus"))
                .body("type", is("INCOME"));
    }
}