package com.family.finances.member.controller;

import com.family.finances.member.dto.CreateMemberRequest;
import com.family.finances.member.dto.UpdateMemberRequest;
import com.family.finances.member.dto.MemberResponse;
import com.family.finances.member.service.MemberService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.jboss.logging.Logger;

import java.util.List;

@Path("/api/members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MemberResource {

    private static final Logger LOGGER = Logger.getLogger(MemberResource.class);

    @Inject
    MemberService memberService;

    private String getUserId(SecurityContext securityContext) {
        return securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal().getName() : null;
    }

    @GET
    public List<MemberResponse> getAllMembers(@Context SecurityContext securityContext) {
        String userId = getUserId(securityContext);
        LOGGER.infof("GET /api/members for userId: %s", userId);
        List<MemberResponse> members = memberService.getAllMembers(userId);
        LOGGER.infof("Found %d active members for userId: %s", members.size(), userId);
        return members;
    }

    @GET
    @Path("/{memberId}")
    public MemberResponse getMemberById(
            @PathParam("memberId") String memberId,
            @Context SecurityContext securityContext) {
        String userId = getUserId(securityContext);
        LOGGER.infof("GET /api/members/%s for userId: %s", memberId, userId);
        return memberService.getMemberById(memberId, userId);
    }

    @POST
    public Response createMember(
            @Valid CreateMemberRequest createMemberRequest,
            @Context SecurityContext securityContext) {
        String userId = getUserId(securityContext);
        LOGGER.infof("POST /api/members for userId: %s, name: %s", userId, createMemberRequest.name);
        MemberResponse member = memberService.createMember(userId, createMemberRequest);
        LOGGER.infof("Successfully created member ID: %s for userId: %s", member.id, userId);
        return Response.status(Response.Status.CREATED).entity(member).build();
    }

    @PUT
    @Path("/{memberId}")
    public MemberResponse updateMember(
            @PathParam("memberId") String memberId,
            @Valid UpdateMemberRequest updateMemberRequest,
            @Context SecurityContext securityContext) {
        String userId = getUserId(securityContext);
        LOGGER.infof("PUT /api/members/%s for userId: %s", memberId, userId);
        return memberService.updateMember(memberId, userId, updateMemberRequest);
    }

    @DELETE
    @Path("/{memberId}")
    public Response deleteMember(
            @PathParam("memberId") String memberId,
            @Context SecurityContext securityContext) {
        String userId = getUserId(securityContext);
        LOGGER.infof("DELETE /api/members/%s for userId: %s", memberId, userId);
        memberService.deleteMember(memberId, userId);
        return Response.noContent().build();
    }
}