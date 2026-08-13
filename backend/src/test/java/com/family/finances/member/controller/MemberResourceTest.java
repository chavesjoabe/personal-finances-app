package com.family.finances.member.controller;

import com.family.finances.user.entity.User;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.entity.Member;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.core.security.JwtTokenProvider;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@QuarkusTest
class MemberResourceTest {

    @InjectMock
    MemberRepository memberRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    private String validToken;
    private Member member;

    @BeforeEach
    void setUp() {
        validToken = jwtTokenProvider.generateToken("60d5ec49f1b2c8123456789f", "test@test.com", "Test User");

        member = new Member();
        member.id = new ObjectId("60d5ec49f1b2c8123456789a");
        member.userId = new ObjectId("60d5ec49f1b2c8123456789f");
        member.name = "Marta";
        member.color = "#E91E63";
        member.active = true;
    }

    @Test
    void shouldGetAllMembers() {
        when(memberRepository.findAllActiveByUser(any())).thenReturn(List.of(member));

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/members")
                .then()
                .statusCode(200)
                .body("[0].name", is("Marta"))
                .body("[0].color", is("#E91E63"));
    }

    @Test
    void shouldGetMemberById() {
        when(memberRepository.findByIdAndUserOptional(any(), any()))
                .thenReturn(Optional.of(member));

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/members/60d5ec49f1b2c8123456789a")
                .then()
                .statusCode(200)
                .body("name", is("Marta"))
                .body("_id", is("60d5ec49f1b2c8123456789a"));
    }

    @Test
    void shouldCreateMember() {
        when(memberRepository.countActiveByUser(any())).thenReturn(1L);

        CreateMemberRequest request = new CreateMemberRequest();
        request.name = "Joabe";
        request.color = "#1976D2";

        given()
                .header("Authorization", "Bearer " + validToken)
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/members")
                .then()
                .statusCode(201)
                .body("name", is("Joabe"))
                .body("color", is("#1976D2"));
    }

    @Test
    void shouldRejectCreatingThirdMember() {
        when(memberRepository.countActiveByUser(any())).thenReturn(2L);

        CreateMemberRequest request = new CreateMemberRequest();
        request.name = "Third Member";
        request.color = "#000000";

        given()
                .header("Authorization", "Bearer " + validToken)
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/members")
                .then()
                .statusCode(400);
    }

    @Test
    void shouldReturn404ForUnknownMember() {
        when(memberRepository.findByIdAndUserOptional(any(), any())).thenReturn(Optional.empty());

        given()
                .header("Authorization", "Bearer " + validToken)
                .when().get("/api/members/60d5ec49f1b2c8123456789a")
                .then()
                .statusCode(404);
    }
}