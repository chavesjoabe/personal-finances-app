package com.family.finances.user.controller;

import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.user.dto.LoginRequest;
import com.family.finances.user.dto.RegisterRequest;
import com.family.finances.user.entity.User;
import com.family.finances.user.repository.UserRepository;
import com.family.finances.core.security.PasswordUtil;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@QuarkusTest
class AuthResourceTest {

    @InjectMock
    UserRepository userRepository;

    @InjectMock
    MemberRepository memberRepository;

    @InjectMock
    CategoryRepository categoryRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.id = new ObjectId("60d5ec49f1b2c8123456789e");
        user.name = "Joabe Chaves";
        user.email = "joabe@test.com";
        user.passwordHash = PasswordUtil.hashPassword("secret123");
    }

    @Test
    void shouldRegisterNewUser() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        RegisterRequest request = new RegisterRequest();
        request.name = "Joabe";
        request.email = "joabe@new.com";
        request.password = "secret123";

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/auth/register")
                .then()
                .statusCode(201)
                .body("token", notNullValue())
                .body("user.name", is("Joabe"))
                .body("user.email", is("joabe@new.com"));
    }

    @Test
    void shouldLoginWithValidCredentials() {
        when(userRepository.findByEmail("joabe@test.com")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest();
        request.email = "joabe@test.com";
        request.password = "secret123";

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/api/auth/login")
                .then()
                .statusCode(200)
                .body("token", notNullValue())
                .body("user.email", is("joabe@test.com"));
    }
}