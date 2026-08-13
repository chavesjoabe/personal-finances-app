package com.family.finances.e2e;

import com.family.finances.category.dto.CategoryResponse;
import com.family.finances.category.dto.CreateCategoryRequest;
import com.family.finances.category.entity.Category;
import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.core.security.JwtTokenProvider;
import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.entity.Member;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.transaction.dto.CreateTransactionRequest;
import com.family.finances.transaction.dto.UpdateTransactionStatusRequest;
import com.family.finances.transaction.entity.Period;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.entity.TransactionStatus;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.transaction.repository.TransactionRepository;
import com.family.finances.user.dto.LoginRequest;
import com.family.finances.user.dto.RegisterRequest;
import com.family.finances.user.entity.User;
import com.family.finances.user.repository.UserRepository;
import com.family.finances.core.security.PasswordUtil;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("E2E Test: Full User & Financial Management Lifecycle")
class FullUserLifecycleE2ETest {

    @InjectMock
    UserRepository userRepository;

    @InjectMock
    MemberRepository memberRepository;

    @InjectMock
    CategoryRepository categoryRepository;

    @InjectMock
    TransactionRepository transactionRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private static final String USER_ID = "60d5ec49f1b2c8123456789a";
    private static final String MEMBER1_ID = "60d5ec49f1b2c8123456789b";
    private static final String CATEGORY_ID = "60d5ec49f1b2c8123456789d";
    private static final String TRANSACTION_ID = "60d5ec49f1b2c8123456789e";

    private String validAuthToken;
    private User testUser;
    private Member primaryMember;
    private Category housingCategory;
    private Transaction rentTransaction;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.id = new ObjectId(USER_ID);
        testUser.name = "Joabe Chaves";
        testUser.email = "joabe@family.com";
        testUser.passwordHash = PasswordUtil.hashPassword("SecurePass123");

        validAuthToken = jwtTokenProvider.generateToken(USER_ID, testUser.email, testUser.name);

        primaryMember = new Member();
        primaryMember.id = new ObjectId(MEMBER1_ID);
        primaryMember.userId = new ObjectId(USER_ID);
        primaryMember.name = "Joabe Chaves";
        primaryMember.color = "#1976D2";
        primaryMember.active = true;

        housingCategory = new Category();
        housingCategory.id = new ObjectId(CATEGORY_ID);
        housingCategory.userId = new ObjectId(USER_ID);
        housingCategory.name = "Moradia";
        housingCategory.type = TransactionType.EXPENSE;
        housingCategory.color = "#FF5722";
        housingCategory.isSystem = true;

        rentTransaction = new Transaction();
        rentTransaction.id = new ObjectId(TRANSACTION_ID);
        rentTransaction.userId = new ObjectId(USER_ID);
        rentTransaction.memberId = new ObjectId(MEMBER1_ID);
        rentTransaction.categoryId = new ObjectId(CATEGORY_ID);
        rentTransaction.type = TransactionType.EXPENSE;
        rentTransaction.description = "Aluguel";
        rentTransaction.amount = new BigDecimal("2500.00");
        rentTransaction.year = 2026;
        rentTransaction.month = 8;
        rentTransaction.period = Period.FIRST_HALF;
        rentTransaction.status = TransactionStatus.PENDING;
    }

    @Test
    @Order(1)
    @DisplayName("E2E Step 1: Register new user -> returns JWT token and user info")
    void testUserRegistration() {
        when(userRepository.findByEmail("newuser@family.com")).thenReturn(Optional.empty());

        RegisterRequest registerReq = new RegisterRequest();
        registerReq.name = "New Family User";
        registerReq.email = "newuser@family.com";
        registerReq.password = "Password123";

        given()
                .contentType(ContentType.JSON)
                .body(registerReq)
                .when().post("/api/auth/register")
                .then()
                .statusCode(201)
                .body("token", notNullValue())
                .body("user.name", is("New Family User"))
                .body("user.email", is("newuser@family.com"));
    }

    @Test
    @Order(2)
    @DisplayName("E2E Step 2: User Login -> returns 200 with JWT token")
    void testUserLogin() {
        when(userRepository.findByEmail("joabe@family.com")).thenReturn(Optional.of(testUser));

        LoginRequest loginReq = new LoginRequest();
        loginReq.email = "joabe@family.com";
        loginReq.password = "SecurePass123";

        given()
                .contentType(ContentType.JSON)
                .body(loginReq)
                .when().post("/api/auth/login")
                .then()
                .statusCode(200)
                .body("token", notNullValue())
                .body("user.email", is("joabe@family.com"));
    }

    @Test
    @Order(3)
    @DisplayName("E2E Step 3: Fetch current user profile (/api/auth/me)")
    void testGetCurrentUserProfile() {
        when(userRepository.findByIdOptional(new ObjectId(USER_ID))).thenReturn(Optional.of(testUser));

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/auth/me")
                .then()
                .statusCode(200)
                .body("name", is("Joabe Chaves"))
                .body("email", is("joabe@family.com"));
    }

    @Test
    @Order(4)
    @DisplayName("E2E Step 4: Manage Family Members -> add 2nd member and enforce max 2 limit")
    void testMemberManagementFlow() {
        when(memberRepository.findAllActiveByUser(USER_ID))
                .thenReturn(List.of(primaryMember));
        when(memberRepository.countActiveByUser(USER_ID))
                .thenReturn(1L);

        // 4a. Get all active members (should return primary member)
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/members")
                .then()
                .statusCode(200)
                .body("[0].name", is("Joabe Chaves"));

        // 4b. Create 2nd member (spouse)
        CreateMemberRequest spouseReq = new CreateMemberRequest();
        spouseReq.name = "Spouse Member";
        spouseReq.color = "#E91E63";

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .contentType(ContentType.JSON)
                .body(spouseReq)
                .when().post("/api/members")
                .then()
                .statusCode(201)
                .body("name", is("Spouse Member"))
                .body("color", is("#E91E63"));

        // 4c. Reject 3rd member creation
        when(memberRepository.countActiveByUser(USER_ID)).thenReturn(2L);

        CreateMemberRequest thirdReq = new CreateMemberRequest();
        thirdReq.name = "Third Member";
        thirdReq.color = "#000000";

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .contentType(ContentType.JSON)
                .body(thirdReq)
                .when().post("/api/members")
                .then()
                .statusCode(400);
    }

    @Test
    @Order(5)
    @DisplayName("E2E Step 5: Manage Categories -> list defaults and add custom category")
    void testCategoryManagementFlow() {
        when(categoryRepository.findAllActiveByUser(USER_ID))
                .thenReturn(List.of(housingCategory));

        // 5a. List categories
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/categories")
                .then()
                .statusCode(200)
                .body("[0].name", is("Moradia"))
                .body("[0].type", is("EXPENSE"));

        // 5b. Add custom category
        CreateCategoryRequest customCatReq = new CreateCategoryRequest();
        customCatReq.name = "Investimentos";
        customCatReq.type = TransactionType.INCOME;
        customCatReq.color = "#4CAF50";

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .contentType(ContentType.JSON)
                .body(customCatReq)
                .when().post("/api/categories")
                .then()
                .statusCode(201)
                .body("name", is("Investimentos"))
                .body("type", is("INCOME"));
    }

    @Test
    @Order(6)
    @DisplayName("E2E Step 6: Create, Update Status, and Delete Transaction")
    void testTransactionLifecycleFlow() {
        // 6a. Create transaction
        CreateTransactionRequest txReq = new CreateTransactionRequest();
        txReq.memberId = MEMBER1_ID;
        txReq.categoryId = CATEGORY_ID;
        txReq.type = TransactionType.EXPENSE;
        txReq.description = "Aluguel";
        txReq.amount = new BigDecimal("2500.00");
        txReq.year = 2026;
        txReq.month = 8;
        txReq.period = Period.FIRST_HALF;
        txReq.status = TransactionStatus.PENDING;

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .contentType(ContentType.JSON)
                .body(txReq)
                .when().post("/api/transactions")
                .then()
                .statusCode(201)
                .body("description", is("Aluguel"))
                .body("amount", is(2500.00f))
                .body("status", is("PENDING"));

        // 6b. Update status to PAID
        when(transactionRepository.findByIdAndUserOptional(eq(TRANSACTION_ID), eq(USER_ID)))
                .thenReturn(Optional.of(rentTransaction));

        UpdateTransactionStatusRequest statusReq = new UpdateTransactionStatusRequest();
        statusReq.status = TransactionStatus.PAID;

        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .contentType(ContentType.JSON)
                .body(statusReq)
                .when().patch("/api/transactions/" + TRANSACTION_ID + "/status")
                .then()
                .statusCode(200)
                .body("status", is("PAID"));

        // 6c. Delete transaction
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().delete("/api/transactions/" + TRANSACTION_ID)
                .then()
                .statusCode(204);
    }

    @Test
    @Order(7)
    @DisplayName("E2E Step 7: Calculate Monthly Vision and Year Analytics")
    void testFinancialAnalyticsFlow() {
        when(memberRepository.findAllActiveByUser(USER_ID))
                .thenReturn(List.of(primaryMember));
        when(categoryRepository.findAllActiveByUser(USER_ID))
                .thenReturn(List.of(housingCategory));
        when(transactionRepository.findByYearAndMonthAndUser(2026, 8, USER_ID))
                .thenReturn(List.of(rentTransaction));
        when(transactionRepository.findByYearAndUser(2026, USER_ID))
                .thenReturn(List.of(rentTransaction));

        // 7a. Get Month Vision
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/months/2026/8")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("month", is(8))
                .body("summary", notNullValue());

        // 7b. Get Year Summary
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/years/2026/summary")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("couple", notNullValue())
                .body("monthlyData.size()", is(12));

        // 7c. Get Year Savings
        given()
                .header("Authorization", "Bearer " + validAuthToken)
                .when().get("/api/years/2026/savings")
                .then()
                .statusCode(200)
                .body("year", is(2026))
                .body("monthlySavings.size()", is(12));
    }
}
