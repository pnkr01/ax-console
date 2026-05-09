import apiClient from "@/core/api/client";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
  status: "active" | "revoked";
}

export class KeyServiceImpl {
  async getKeys(tenantSlug: string): Promise<ApiKey[]> {
    const response = await apiClient.get(`/tenants/${tenantSlug}/keys`);
    return response.data.keys || []; // Adjust based on your Go response wrapper
  }

  async revokeKey(tenantSlug: string, keyId: string): Promise<void> {
    await apiClient.delete(`/tenants/${tenantSlug}/keys/${keyId}`);
  }
}

export const keyService = new KeyServiceImpl();