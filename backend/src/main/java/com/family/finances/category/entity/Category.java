package com.family.finances.category.entity;

import com.family.finances.transaction.entity.TransactionType;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.types.ObjectId;

@MongoEntity(collection = "categories")
public class Category extends PanacheMongoEntity {
    public ObjectId userId;
    public String name;
    public TransactionType type;
    public String color;
    public boolean isSystem = false;
    public boolean active = true;
}