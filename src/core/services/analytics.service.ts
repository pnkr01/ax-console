import apiClient from "@/core/api/client";

export interface DashboardKPIs {
  totalInvocations: number;
  avgLatencyMs: number;
  hallucinationRate: number;
  trendData: { date: string; invocations: number; latency: number }[];
}

export interface FunnelResult {
  step: string;
  count: number;
  color: string;
}

export class AnalyticsServiceImpl {
  async getOverviewKPIs(tenantSlug: string): Promise<DashboardKPIs> {
    const response = await apiClient.get(`/tenants/${tenantSlug}/analytics/overview`);
    return response.data;
  }

  async runFunnelQuery(tenantSlug: string, steps: string[]): Promise<FunnelResult[]> {
    const response = await apiClient.post(`/tenants/${tenantSlug}/analytics/funnels`, { steps });
    return response.data.results || [];
  }
}

export const analyticsService = new AnalyticsServiceImpl();