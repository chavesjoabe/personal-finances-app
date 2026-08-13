package com.family.finances.transaction.controller;

import com.family.finances.user.entity.User;

import com.family.finances.transaction.repository.TransactionRepository;
import com.family.finances.core.security.JwtTokenProvider;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@QuarkusTest
class MonthResourceTest {

    @InjectMock
    TransactionRepository transactionRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private String validToken;

    @BeforeEach
    void setUp() {
        validToken = jwtTokenProvider.generateToken("60d5ec49f1b2c8123456789f", "test@test.com", "Test User");
    }

    @Test
    void shouldGetMonthVision() {
        when(transactionRepository.findByYearAndMonthAndUser(eq(2026), eq(8), any())).thenReturn(List.of());

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/months/2026/8")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("month", is(8))
                .body("isEmpty", is(true));
    }
}