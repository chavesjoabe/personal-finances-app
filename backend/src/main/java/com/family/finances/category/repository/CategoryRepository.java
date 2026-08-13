package com.family.finances.category.repository;

import com.family.finances.category.entity.Category;
import com.family.finances.transaction.entity.TransactionType;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CategoryRepository implements PanacheMongoRepository<Category> {

    public List<Category> findByTypeAndUser(TransactionType type, String userId) {
        if (userId == null) {
            return find("{'type': ?1, 'active': {'$ne': false}}", type).list();
        }
        return find("{'type': ?1, '$or': [{'userId': ?2}, {'userId': null}], 'active': {'$ne': false}}", type, new ObjectId(userId)).list();
    }

    public List<Category> findAllActiveByUser(String userId) {
        if (userId == null) {
            return find("{'active': {'$ne': false}}").list();
        }
        return find("{'$or': [{'userId': ?1}, {'userId': null}], 'active': {'$ne': false}}", new ObjectId(userId)).list();
    }

    public Optional<Category> findByIdAndUserOptional(String categoryId, String userId) {
        try {
            ObjectId cId = new ObjectId(categoryId);
            if (userId == null) {
                return findByIdOptional(cId);
            }
            return find("{'_id': ?1, '$or': [{'userId': ?2}, {'userId': null}]}", cId, new ObjectId(userId)).firstResultOptional();
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}