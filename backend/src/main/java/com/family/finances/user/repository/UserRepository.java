package com.family.finances.user.repository;

import com.family.finances.user.entity.User;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<User> {

    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return find("email", email.trim().toLowerCase()).firstResultOptional();
    }
}