package com.family.finances.member.repository;

import com.family.finances.member.entity.Member;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class MemberRepository implements PanacheMongoRepository<Member> {

    public List<Member> findAllActiveByUser(String userId) {
        if (userId == null) {
            return find("{'active': {'$ne': false}}").list();
        }
        return find("{'userId': ?1, 'active': {'$ne': false}}", new ObjectId(userId)).list();
    }

    public Optional<Member> findByIdAndUserOptional(String memberId, String userId) {
        try {
            ObjectId mId = new ObjectId(memberId);
            if (userId == null) {
                return findByIdOptional(mId);
            }
            return find("{'_id': ?1, 'userId': ?2, 'active': {'$ne': false}}", mId, new ObjectId(userId)).firstResultOptional();
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public long countActiveByUser(String userId) {
        if (userId == null) {
            return count("{'active': {'$ne': false}}");
        }
        return count("{'userId': ?1, 'active': {'$ne': false}}", new ObjectId(userId));
    }
}