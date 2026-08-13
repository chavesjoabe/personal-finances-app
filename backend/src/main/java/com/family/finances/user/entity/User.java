package com.family.finances.user.entity;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

import java.time.Instant;

@MongoEntity(collection = "users")
public class User extends PanacheMongoEntity {
    public String name;
    public String email;
    public String passwordHash;
    public Instant createdAt;
    public Instant updatedAt;
}