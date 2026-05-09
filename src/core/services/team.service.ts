import apiClient from "@/core/api/client";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "VIEWER";
  status: "ACTIVE" | "PENDING";
  joined_at: string;
}

export class TeamServiceImpl {
  async getMembers(tenantSlug: string): Promise<TeamMember[]> {
    const response = await apiClient.get(`/tenants/${tenantSlug}/members`);
    return response.data.members || [];
  }

  async inviteMember(tenantSlug: string, email: string, role: string): Promise<void> {
    await apiClient.post(`/tenants/${tenantSlug}/invites`, { email, role });
  }
}

export const teamService = new TeamServiceImpl();