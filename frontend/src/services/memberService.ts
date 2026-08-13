import httpClient, { isMockEnabled } from "./httpClient";
import { mockDatabase } from "./mockData";
import {
  MemberResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
} from "../types";

async function getMembers(): Promise<MemberResponse[]> {
  if (isMockEnabled()) {
    return mockDatabase.getMembers();
  }
  const response = await httpClient.get<MemberResponse[]>("/members");
  return response.data;
}

async function createMember(memberData: CreateMemberRequest): Promise<MemberResponse> {
  if (isMockEnabled()) {
    const members = mockDatabase.getMembers();
    const newMember: MemberResponse = {
      _id: `member-${Date.now()}`,
      name: memberData.name,
      color: memberData.color || "#1976D2",
      active: true,
    };
    members.push(newMember);
    mockDatabase.saveMembers(members);
    return newMember;
  }
  const response = await httpClient.post<MemberResponse>("/members", memberData);
  return response.data;
}

async function updateMember(
  memberId: string,
  memberData: UpdateMemberRequest
): Promise<MemberResponse> {
  if (isMockEnabled()) {
    const members = mockDatabase.getMembers();
    const index = members.findIndex((m) => m._id === memberId);
    if (index !== -1) {
      members[index] = { ...members[index], ...memberData };
      mockDatabase.saveMembers(members);
      return members[index];
    }
    throw new Error("Member not found");
  }
  const response = await httpClient.put<MemberResponse>(`/members/${memberId}`, memberData);
  return response.data;
}

async function deleteMember(memberId: string): Promise<void> {
  if (isMockEnabled()) {
    const members = mockDatabase.getMembers();
    const updated = members.filter((m) => m._id !== memberId);
    mockDatabase.saveMembers(updated);
    return;
  }
  await httpClient.delete(`/members/${memberId}`);
}

const memberService = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
};

export default memberService;
