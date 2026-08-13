package com.family.finances.user.service;

import com.family.finances.user.dto.LoginRequest;
import com.family.finances.user.dto.RegisterRequest;
import com.family.finances.user.dto.AuthResponse;
import com.family.finances.member.entity.Member;
import com.family.finances.user.entity.User;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.user.repository.UserRepository;
import com.family.finances.core.security.JwtTokenProvider;
import com.family.finances.core.security.PasswordUtil;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = new User();
        existingUser.id = new ObjectId("60d5ec49f1b2c8123456789e");
        existingUser.name = "Joabe Chaves";
        existingUser.email = "joabe@test.com";
        existingUser.passwordHash = PasswordUtil.hashPassword("secret123");
    }

    @Test
    void shouldRegisterNewUserAndCreateDefaultMember() {
        RegisterRequest request = new RegisterRequest();
        request.name = "Marta Chaves";
        request.email = "marta@test.com";
        request.password = "password123";

        when(userRepository.findByEmail("marta@test.com")).thenReturn(Optional.empty());
        when(jwtTokenProvider.generateToken(any(), eq("marta@test.com"), eq("Marta Chaves")))
                .thenReturn("mocked-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.token);
        assertEquals("Marta Chaves", response.user.name);
        assertEquals("marta@test.com", response.user.email);

        verify(userRepository).persist(any(User.class));
        verify(memberRepository).persist(any(Member.class));
    }

    @Test
    void shouldThrowExceptionWhenRegisteringExistingEmail() {
        RegisterRequest request = new RegisterRequest();
        request.name = "Joabe";
        request.email = "joabe@test.com";
        request.password = "secret123";

        when(userRepository.findByEmail("joabe@test.com")).thenReturn(Optional.of(existingUser));

        assertThrows(InvalidOperationException.class, () -> authService.register(request));
    }

    @Test
    void shouldLoginWithValidCredentials() {
        LoginRequest request = new LoginRequest();
        request.email = "joabe@test.com";
        request.password = "secret123";

        when(userRepository.findByEmail("joabe@test.com")).thenReturn(Optional.of(existingUser));
        when(jwtTokenProvider.generateToken(existingUser.id.toHexString(), "joabe@test.com", "Joabe Chaves"))
                .thenReturn("valid-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("valid-jwt-token", response.token);
        assertEquals("Joabe Chaves", response.user.name);
    }
}