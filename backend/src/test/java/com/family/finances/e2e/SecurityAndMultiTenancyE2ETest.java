package com.family.finances.e2e;

import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.core.security.JwtTokenProvider;
import com.family.finances.member.entity.Member;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.transaction.entity.Transaction;
import com.family.finances.transaction.repository.TransactionRepository;
import com.family.finances.user.repository.UserRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@QuarkusTest
@DisplayName("E2E Test: Security & Multi-Tenant Data Isolation Enforcement")
class SecurityAndMultiTenancyE2ETest {

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

    private static final String USER_A_ID = "60d5ec49f1b2c8123456789a";
    private static final String USER_B_ID = "60d5ec49f1b2c8123456789b";
    private static final String MEMBER_A_ID = "60d5ec49f1b2c8123456789c";

    private String userAToken;
    private String userBToken;

    @BeforeEach
    void setUp() {
        userAToken = jwtTokenProvider.generateToken(USER_A_ID, "usera@test.com", "User A");
        userBToken = jwtTokenProvider.generateToken(USER_B_ID, "userb@test.com", "User B");
    }

    @Test
    @DisplayName("Security E2E: Unauthenticated requests without JWT header are rejected")
    void testUnauthenticatedAccessIsRejected() {
        given()
                .when().get("/api/members")
                .then()
                .statusCode(401);

        given()
                .when().get("/api/categories")
                .then()
                .statusCode(401);

        given()
                .when().get("/api/months/2026/8")
                .then()
                .statusCode(401);

        given()
                .when().get("/api/years/2026/summary")
                .then()
                .statusCode(401);
    }

    @Test
    @DisplayName("Security E2E: Tampered or invalid Bearer tokens are rejected with 401")
    void testInvalidTokenIsRejected() {
        String invalidToken = "Bearer invalid.jwt.token.signature";

        given()
                .header("Authorization", invalidToken)
                .when().get("/api/members")
                .then()
                .statusCode(401);
    }

    @Test
    @DisplayName("Multi-Tenancy E2E: User B cannot access User A's member details")
    void testMultiTenantIsolationForMembers() {
        Member memberA = new Member();
        memberA.id = new ObjectId(MEMBER_A_ID);
        memberA.userId = new ObjectId(USER_A_ID);
        memberA.name = "User A Member";
        memberA.color = "#1976D2";

        // When queried for User A -> returns member
        when(memberRepository.findByIdAndUserOptional(eq(MEMBER_A_ID), eq(USER_A_ID)))
                .thenReturn(Optional.of(memberA));

        // When queried for User B -> returns empty
        when(memberRepository.findByIdAndUserOptional(eq(MEMBER_A_ID), eq(USER_B_ID)))
                .thenReturn(Optional.empty());

        // User A request -> 200 OK
        given()
                .header("Authorization", "Bearer " + userAToken)
                .when().get("/api/members/" + MEMBER_A_ID)
                .then()
                .statusCode(200);

        // User B request -> 404 Not Found (Data Isolation)
        given()
                .header("Authorization", "Bearer " + userBToken)
                .when().get("/api/members/" + MEMBER_A_ID)
                .then()
                .statusCode(404);
    }
}
