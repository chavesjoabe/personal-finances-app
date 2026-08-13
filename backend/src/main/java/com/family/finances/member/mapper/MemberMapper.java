package com.family.finances.member.mapper;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.dto.UpdateMemberRequest;
import com.family.finances.member.dto.MemberResponse;
import com.family.finances.member.entity.Member;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class MemberMapper {

    public Member toEntity(CreateMemberRequest request) {
        Member member = new Member();
        member.name = request.name;
        member.color = request.color != null && !request.color.isBlank() ? request.color : "#1976D2";
        member.active = true;
        return member;
    }

    public void updateEntityFromRequest(UpdateMemberRequest request, Member member) {
        if (request.name != null && !request.name.isBlank()) {
            member.name = request.name;
        }
        if (request.color != null && !request.color.isBlank()) {
            member.color = request.color;
        }
        if (request.active != null) {
            member.active = request.active;
        }
    }

    public MemberResponse toResponse(Member member) {
        MemberResponse response = new MemberResponse();
        response.id = member.id != null ? member.id.toHexString() : null;
        response.name = member.name;
        response.color = member.color;
        response.active = member.active;
        return response;
    }

    public List<MemberResponse> toResponseList(List<Member> members) {
        return members.stream().map(this::toResponse).toList();
    }
}