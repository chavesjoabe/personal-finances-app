package com.family.finances.member.entity;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.types.ObjectId;

@MongoEntity(collection = "members")
public class Member extends PanacheMongoEntity {
    public ObjectId userId;
    public String name;
    public String color;
    public boolean active = true;
}