package com.family.finances.transaction.controller;

import com.family.finances.user.entity.User;

import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionStatusRequest;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.transaction.repository.TransactionRepository;
import com.family.finances.core.security.JwtTokenProvider;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@QuarkusTest
class TransactionResourceTest {

    @InjectMock
    TransactionRepository transactionRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private String validToken;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        validToken = jwtTokenProvider.generateToken("60d5ec49f1b2c8123456789f", "test@test.com", "Test User");

        transaction = new Transaction();
        transaction.id = new ObjectId("60d5ec49f1b2c8123456789d");
        transaction.userId = new ObjectId("60d5ec49f1b2c8123456789f");
        transaction.memberId = new ObjectId("60d5ec49f1b2c8123456789a");
        transaction.categoryId = new ObjectId("60d5ec49f1b2c8123456789b");
        transaction.type = TransactionType.EXPENSE;
        transaction.description = "Aluguel";
        transaction.amount = new BigDecimal("2200.00");
        transaction.year = 2026;
        transaction.month = 8;
        transaction.period = Period.FIRST_HALF;
        transaction.status = TransactionStatus.PENDING;
    }

    @Test
    void shouldCreateTransaction() {
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.memberId = "60d5ec49f1b2c8123456789a";
        request.categoryId = "60d5ec49f1b2c8123456789b";
        request.type = TransactionType.EXPENSE;
        request.description = "Aluguel";
        request.amount = new BigDecimal("2200.00");
        request.year = 2026;
        request.month = 8;
        request.period = Period.FIRST_HALF;
        request.status = TransactionStatus.PENDING;

        given()
                .header("Authorization", "Bearer " + validToken)
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/transactions")
                .then()
                .statusCode(201)
                .body("description", is("Aluguel"))
                .body("amount", is(2200.00f));
    }

    @Test
    void shouldUpdateTransactionStatus() {
        when(transactionRepository.findByIdAndUserOptional(any(), any())).thenReturn(Optional.of(transaction));

        UpdateTransactionStatusRequest statusRequest = new UpdateTransactionStatusRequest();
        statusRequest.status = TransactionStatus.PAID;

        given()
                .header("Authorization", "Bearer " + validToken)
                .contentType(ContentType.JSON)
                .body(statusRequest)
                .when().patch("/api/transactions/60d5ec49f1b2c8123456789d/status")
                .then()
                .statusCode(200)
                .body("status", is("PAID"));
    }
}