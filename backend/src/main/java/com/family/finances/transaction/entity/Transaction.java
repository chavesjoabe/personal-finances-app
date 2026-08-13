package com.family.finances.transaction.entity;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.types.ObjectId;

import java.math.BigDecimal;
import java.time.Instant;

@MongoEntity(collection = "transactions")
public class Transaction extends PanacheMongoEntity {
    public ObjectId userId;
    public ObjectId memberId;
    public ObjectId categoryId;
    public TransactionType type;
    public String description;
    public BigDecimal amount;
    public int year;
    public int month;
    public Period period;
    public TransactionStatus status;
    public Instant paidAt;
    public ObjectId copiedFrom;
    public Instant createdAt;
    public Instant updatedAt;
}