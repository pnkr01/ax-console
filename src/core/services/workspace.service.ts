import apiClient from "@/core/api/client";
import { WorkspaceInput } from "@/shared/lib/schemas";

// 1. Define the Interface (Contract)
export interface IWorkspaceService {
  createWorkspace(data: WorkspaceInput): Promise<{ tenantSlug: string }>;
}

// 2. Create the Implementation
export class WorkspaceServiceImpl implements IWorkspaceService {
  async createWorkspace(data: WorkspaceInput): Promise<{ tenantSlug: string }> {
    const response = await apiClient.post("/tenants", data);
    
    return {
      // Normalize the response in case the Go backend capitalizes keys differently
      tenantSlug: response.data.Slug || response.data.slug,
    };
  }
}

// 3. Export a singleton instance for use across the application
export const workspaceService = new WorkspaceServiceImpl();