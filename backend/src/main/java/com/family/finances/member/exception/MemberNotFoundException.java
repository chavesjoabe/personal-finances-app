package com.family.finances.member.exception;

import com.family.finances.member.entity.Member;

public class MemberNotFoundException extends RuntimeException {

    public MemberNotFoundException(String memberId) {
        super("Member not found: " + memberId);
    }
}