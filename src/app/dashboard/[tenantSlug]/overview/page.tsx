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
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
        <p className="font-medium text-sm">Failed to load telemetry data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
        <p className="text-zinc-500 mt-1.5 text-sm">Real-time telemetry for <span className="font-semibold text-zinc-700">{tenantSlug}</span>.</p>
      </div>

      {/* Dynamic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Invocations" value={data.totalInvocations.toLocaleString()} icon={<Zap className="w-5 h-5" />} color="blue" />
        <MetricCard title="Avg Latency" value={`${data.avgLatencyMs}ms`} icon={<BrainCircuit className="w-5 h-5" />} color="indigo" />
        <MetricCard title="Hallucination Rate" value={`${data.hallucinationRate}%`} icon={<ShieldAlert className="w-5 h-5" />} color="red" />
      </div>

      {/* Telemetry Trend Chart */}
      <div className="bg-white p-7 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8">
            <h2 className="font-semibold text-zinc-900">Invocation Volume</h2>
            <span className="text-[11px] font-medium px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full">Last 7 Days</span>
        </div>
        
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvocations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? val/1000 + 'k' : val}`} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="invocations" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorInvocations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: "blue" | "indigo" | "red" }) {
  const variants = {
    blue: "text-blue-600 bg-blue-50 ring-blue-200/50",
    indigo: "text-indigo-600 bg-indigo-50 ring-indigo-200/50",
    red: "text-red-600 bg-red-50 ring-red-200/50",
  };

  return (
    <div className="relative overflow-hidden bg-white px-6 py-5 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-zinc-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-zinc-900 tabular-nums">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ring-1 ${variants[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-zinc-50 rounded-full opacity-50 group-hover:scale-125 transition-transform" />
    </div>
  );
}