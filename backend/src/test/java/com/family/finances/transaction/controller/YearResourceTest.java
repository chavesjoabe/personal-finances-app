package com.family.finances.transaction.controller;

import com.family.finances.user.entity.User;

import com.family.finances.member.repository.MemberRepository;
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
class YearResourceTest {

    @InjectMock
    TransactionRepository transactionRepository;

    @InjectMock
    MemberRepository memberRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private String validToken;

    @BeforeEach
    void setUp() {
        validToken = jwtTokenProvider.generateToken("60d5ec49f1b2c8123456789f", "test@test.com", "Test User");
    }

    @Test
    void shouldGetYearSummary() {
        when(transactionRepository.findByYearAndUser(eq(2026), any())).thenReturn(List.of());
        when(memberRepository.findAllActiveByUser(any())).thenReturn(List.of());

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/years/2026/summary")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("monthlyData.size()", is(12));
    }

    @Test
    void shouldGetYearSavings() {
        when(transactionRepository.findByYearAndUser(eq(2026), any())).thenReturn(List.of());
        when(memberRepository.findAllActiveByUser(any())).thenReturn(List.of());

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/years/2026/savings")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("monthlySavings.size()", is(12));
    }
}