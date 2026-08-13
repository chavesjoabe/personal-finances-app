package com.family.finances.member.service;

import com.family.finances.user.entity.User;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.dto.UpdateMemberRequest;
import com.family.finances.member.dto.MemberResponse;
import com.family.finances.member.entity.Member;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.member.exception.MemberNotFoundException;
import com.family.finances.member.mapper.MemberMapper;
import com.family.finances.member.repository.MemberRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.jboss.logging.Logger;

import java.util.List;

@ApplicationScoped
public class MemberService {

    private static final Logger LOGGER = Logger.getLogger(MemberService.class);

    @Inject
    MemberRepository memberRepository;

    @Inject
    MemberMapper memberMapper;

    public List<MemberResponse> getAllMembers(String userId) {
        LOGGER.infof("Fetching all active members for userId: %s", userId);
        List<Member> members = memberRepository.findAllActiveByUser(userId);
        LOGGER.infof("Repository returned %d member documents for userId: %s", members.size(), userId);
        return memberMapper.toResponseList(members);
    }

    public MemberResponse getMemberById(String memberId, String userId) {
        Member member = findMemberOrThrow(memberId, userId);
        return memberMapper.toResponse(member);
    }

    public MemberResponse createMember(String userId, CreateMemberRequest createMemberRequest) {
        LOGGER.infof("Creating member for userId: %s, name: %s", userId, createMemberRequest.name);
        long currentMemberCount = memberRepository.countActiveByUser(userId);
        if (currentMemberCount >= 2) {
            LOGGER.warnf("User %s already has %d active members. Rejection triggered.", userId, currentMemberCount);
            throw new InvalidOperationException("Users can add at most 1 additional family member (maximum 2 members per account).");
        }

        Member member = memberMapper.toEntity(createMemberRequest);
        if (userId != null) {
            member.userId = new ObjectId(userId);
        }
        member.active = true;
        memberRepository.persist(member);
        LOGGER.infof("Successfully persisted member '%s' (ID: %s) for user: %s", member.name, member.id != null ? member.id.toHexString() : "null", userId);
        return memberMapper.toResponse(member);
    }

    public MemberResponse updateMember(String memberId, String userId, UpdateMemberRequest updateMemberRequest) {
        Member member = findMemberOrThrow(memberId, userId);
        memberMapper.updateEntityFromRequest(updateMemberRequest, member);
        memberRepository.update(member);
        LOGGER.infof("Updated member %s for userId: %s", memberId, userId);
        return memberMapper.toResponse(member);
    }

    public void deleteMember(String memberId, String userId) {
        Member member = findMemberOrThrow(memberId, userId);
        member.active = false;
        memberRepository.update(member);
        LOGGER.infof("Deactivated member %s for userId: %s", memberId, userId);
    }

    private Member findMemberOrThrow(String memberId, String userId) {
        return memberRepository.findByIdAndUserOptional(memberId, userId)
                .orElseThrow(() -> new MemberNotFoundException(memberId));
    }
}