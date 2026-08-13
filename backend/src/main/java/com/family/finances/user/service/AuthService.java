package com.family.finances.user.service;

import com.family.finances.user.dto.LoginRequest;
import com.family.finances.user.dto.RegisterRequest;
import com.family.finances.user.dto.AuthResponse;
import com.family.finances.user.dto.UserResponse;
import com.family.finances.category.entity.Category;
import com.family.finances.member.entity.Member;
import com.family.finances.transaction.entity.TransactionType;
import com.family.finances.user.entity.User;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.category.repository.CategoryRepository;
import com.family.finances.member.repository.MemberRepository;
import com.family.finances.user.repository.UserRepository;
import com.family.finances.core.security.JwtTokenProvider;
import com.family.finances.core.security.PasswordUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Inject
    MemberRepository memberRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest registerRequest) {
        String normalizedEmail = registerRequest.email.trim().toLowerCase();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new InvalidOperationException("User with email '" + normalizedEmail + "' already exists.");
        }

        User user = new User();
        user.id = new ObjectId();
        user.name = registerRequest.name.trim();
        user.email = normalizedEmail;
        user.passwordHash = PasswordUtil.hashPassword(registerRequest.password);
        user.createdAt = Instant.now();
        user.updatedAt = Instant.now();

        userRepository.persist(user);

        // Auto-create initial default Member for the user
        Member defaultMember = new Member();
        defaultMember.userId = user.id;
        defaultMember.name = user.name;
        defaultMember.color = "#1976D2";
        defaultMember.active = true;
        memberRepository.persist(defaultMember);

        // Seed default categories for user if user has none
        seedCategoriesForUser(user.id);

        String userIdStr = user.id.toHexString();
        String token = jwtTokenProvider.generateToken(userIdStr, user.email, user.name);

        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        String normalizedEmail = loginRequest.email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidOperationException("Invalid email or password."));

        if (!PasswordUtil.verifyPassword(loginRequest.password, user.passwordHash)) {
            throw new InvalidOperationException("Invalid email or password.");
        }

        String userIdStr = user.id.toHexString();
        String token = jwtTokenProvider.generateToken(userIdStr, user.email, user.name);

        return new AuthResponse(token, toUserResponse(user));
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findByIdOptional(new ObjectId(userId))
                .orElseThrow(() -> new InvalidOperationException("User not found."));

        return toUserResponse(user);
    }

    private void seedCategoriesForUser(ObjectId userId) {
        if (categoryRepository.findAllActiveByUser(userId.toHexString()).size() > 0) {
            return;
        }

        List<Category> categories = List.of(
                // Receitas
                buildCategory(userId, "Salário", TransactionType.INCOME, "#4CAF50"),
                buildCategory(userId, "Vale Alimentação / Refeição", TransactionType.INCOME, "#8BC34A"),
                buildCategory(userId, "Reembolso", TransactionType.INCOME, "#009688"),
                buildCategory(userId, "Bônus / PLR", TransactionType.INCOME, "#00BCD4"),
                buildCategory(userId, "Outras Receitas", TransactionType.INCOME, "#03A9F4"),

                // Despesas
                buildCategory(userId, "Dízimo", TransactionType.EXPENSE, "#9C27B0"),
                buildCategory(userId, "Oferta / Compromisso", TransactionType.EXPENSE, "#673AB7"),
                buildCategory(userId, "Cartão de Crédito", TransactionType.EXPENSE, "#ED7D31"),
                buildCategory(userId, "Cartão Loja", TransactionType.EXPENSE, "#FF9800"),
                buildCategory(userId, "Taxa de Condomínio", TransactionType.EXPENSE, "#795548"),
                buildCategory(userId, "Aluguel / Financiamento", TransactionType.EXPENSE, "#607D8B"),
                buildCategory(userId, "Internet", TransactionType.EXPENSE, "#2196F3"),
                buildCategory(userId, "Despesas com Carro", TransactionType.EXPENSE, "#F44336"),
                buildCategory(userId, "Energia Elétrica", TransactionType.EXPENSE, "#FFC107"),
                buildCategory(userId, "Outras Despesas", TransactionType.EXPENSE, "#9E9E9E"),

                // Reservas
                buildCategory(userId, "Reserva de Emergência", TransactionType.SAVINGS, "#3F51B5"),
                buildCategory(userId, "Fundo de Investimento", TransactionType.SAVINGS, "#1A237E")
        );

        categoryRepository.persist(categories);
    }

    private Category buildCategory(ObjectId userId, String name, TransactionType type, String color) {
        Category category = new Category();
        category.userId = userId;
        category.name = name;
        category.type = type;
        category.color = color;
        category.isSystem = true;
        category.active = true;
        return category;
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.id = user.id != null ? user.id.toHexString() : null;
        response.name = user.name;
        response.email = user.email;
        return response;
    }
}