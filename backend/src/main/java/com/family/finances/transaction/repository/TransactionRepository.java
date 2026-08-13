package com.family.finances.transaction.repository;

import com.family.finances.transaction.entity.Transaction;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TransactionRepository implements PanacheMongoRepository<Transaction> {

    public List<Transaction> findByYearAndMonthAndUser(int year, int month, String userId) {
        if (userId == null) {
            return find("{'year': ?1, 'month': ?2}", year, month).list();
        }
        return find("{'year': ?1, 'month': ?2, 'userId': ?3}", year, month, new ObjectId(userId)).list();
    }

    public List<Transaction> findByYearAndUser(int year, String userId) {
        if (userId == null) {
            return find("{'year': ?1}", year).list();
        }
        return find("{'year': ?1, 'userId': ?2}", year, new ObjectId(userId)).list();
    }

    public Optional<Transaction> findByIdAndUserOptional(String transactionId, String userId) {
        try {
            ObjectId tId = new ObjectId(transactionId);
            if (userId == null) {
                return findByIdOptional(tId);
            }
            return find("{'_id': ?1, 'userId': ?2}", tId, new ObjectId(userId)).firstResultOptional();
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}