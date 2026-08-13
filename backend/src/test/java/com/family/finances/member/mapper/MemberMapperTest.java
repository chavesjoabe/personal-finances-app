package com.family.finances.member.mapper;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.dto.UpdateMemberRequest;
import com.family.finances.member.dto.MemberResponse;
import com.family.finances.member.entity.Member;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MemberMapperTest {

    private MemberMapper memberMapper;

    @BeforeEach
    void setUp() {
        memberMapper = new MemberMapper();
    }

    @Test
    void shouldMapCreateRequestToEntity() {
        CreateMemberRequest request = new CreateMemberRequest();
        request.name = "Joabe";
        request.color = "#1976D2";

        Member member = memberMapper.toEntity(request);

        assertNotNull(member);
        assertEquals("Joabe", member.name);
        assertEquals("#1976D2", member.color);
        assertTrue(member.active);
    }

    @Test
    void shouldMapEntityToResponse() {
        Member member = new Member();
        member.id = new ObjectId("60d5ec49f1b2c8123456789a");
        member.name = "Marta";
        member.color = "#E91E63";
        member.active = true;

        MemberResponse response = memberMapper.toResponse(member);

        assertNotNull(response);
        assertEquals("60d5ec49f1b2c8123456789a", response.id);
        assertEquals("60d5ec49f1b2c8123456789a", response.getUnderscoreId());
        assertEquals("Marta", response.name);
        assertEquals("#E91E63", response.color);
        assertTrue(response.active);
    }

    @Test
    void shouldUpdateEntityFromRequest() {
        Member member = new Member();
        member.name = "Marta";
        member.color = "#E91E63";
        member.active = true;

        UpdateMemberRequest request = new UpdateMemberRequest();
        request.name = "Marta Chaves";
        request.color = "#000000";

        memberMapper.updateEntityFromRequest(request, member);

        assertEquals("Marta Chaves", member.name);
        assertEquals("#000000", member.color);
    }
}