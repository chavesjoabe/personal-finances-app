package com.family.finances.member.service;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.dto.MemberResponse;
import com.family.finances.member.entity.Member;
import com.family.finances.core.exception.InvalidOperationException;
import com.family.finances.member.exception.MemberNotFoundException;
import com.family.finances.member.mapper.MemberMapper;
import com.family.finances.member.repository.MemberRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Spy
    private MemberMapper memberMapper = new MemberMapper();

    @InjectMocks
    private MemberService memberService;

    private Member member1;
    private Member member2;
    private ObjectId userId;

    @BeforeEach
    void setUp() {
        userId = new ObjectId("60d5ec49f1b2c8123456789f");

        member1 = new Member();
        member1.id = new ObjectId("60d5ec49f1b2c8123456789a");
        member1.userId = userId;
        member1.name = "Joabe";
        member1.color = "#1976D2";
        member1.active = true;

        member2 = new Member();
        member2.id = new ObjectId("60d5ec49f1b2c8123456789b");
        member2.userId = userId;
        member2.name = "Marta";
        member2.color = "#E91E63";
        member2.active = true;
    }

    @Test
    void shouldReturnAllActiveMembersForUser() {
        when(memberRepository.findAllActiveByUser(userId.toHexString())).thenReturn(List.of(member1));

        List<MemberResponse> result = memberService.getAllMembers(userId.toHexString());

        assertEquals(1, result.size());
        assertEquals("Joabe", result.get(0).name);
    }

    @Test
    void shouldReturnMemberByIdForUser() {
        when(memberRepository.findByIdAndUserOptional("60d5ec49f1b2c8123456789a", userId.toHexString()))
                .thenReturn(Optional.of(member1));

        MemberResponse result = memberService.getMemberById("60d5ec49f1b2c8123456789a", userId.toHexString());

        assertNotNull(result);
        assertEquals("Joabe", result.name);
    }

    @Test
    void shouldThrowExceptionWhenMemberNotFound() {
        when(memberRepository.findByIdAndUserOptional(any(), any()))
                .thenReturn(Optional.empty());

        assertThrows(MemberNotFoundException.class, () ->
                memberService.getMemberById("60d5ec49f1b2c8123456789a", userId.toHexString()));
    }

    @Test
    void shouldCreateSecondMemberSuccessfully() {
        when(memberRepository.countActiveByUser(userId.toHexString())).thenReturn(1L);

        CreateMemberRequest request = new CreateMemberRequest();
        request.name = "Marta";
        request.color = "#E91E63";

        MemberResponse result = memberService.createMember(userId.toHexString(), request);

        assertNotNull(result);
        assertEquals("Marta", result.name);
        verify(memberRepository).persist(any(Member.class));
    }

    @Test
    void shouldRejectCreatingThirdMember() {
        when(memberRepository.countActiveByUser(userId.toHexString())).thenReturn(2L);

        CreateMemberRequest request = new CreateMemberRequest();
        request.name = "Third Member";
        request.color = "#000000";

        InvalidOperationException ex = assertThrows(InvalidOperationException.class, () ->
                memberService.createMember(userId.toHexString(), request));

        assertTrue(ex.getMessage().contains("maximum 2 members per account"));
        verify(memberRepository, never()).persist(any(Member.class));
    }
}