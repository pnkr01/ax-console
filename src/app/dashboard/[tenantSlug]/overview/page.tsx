"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { BrainCircuit, ShieldAlert, Zap, Loader2, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { analyticsService } from "@/core/services/analytics.service";

export default function OverviewPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['overview-kpis', tenantSlug],
    queryFn: () => analyticsService.getOverviewKPIs(tenantSlug),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <p className="font-medium">Failed to load telemetry data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Real-time telemetry for <span className="font-semibold text-slate-700">{tenantSlug}</span>.</p>
      </div>

      {/* Dynamic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Invocations" value={data.totalInvocations.toLocaleString()} icon={<Zap className="w-6 h-6" />} color="blue" />
        <MetricCard title="Avg Latency" value={`${data.avgLatencyMs}ms`} icon={<BrainCircuit className="w-6 h-6" />} color="indigo" />
        <MetricCard title="Hallucination Rate" value={`${data.hallucinationRate}%`} icon={<ShieldAlert className="w-6 h-6" />} color="red" />
      </div>

      {/* Telemetry Trend Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-6">Invocation Volume (Last 7 Days)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvocations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? val/1000 + 'k' : val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="invocations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvocations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: "blue" | "indigo" | "red" }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}