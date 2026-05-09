import { BrainCircuit, ShieldAlert, Zap } from "lucide-react";

export default async function OverviewPage({ params }: { params: { tenantSlug: string } }) {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenantSlug;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Real-time telemetry for <span className="font-semibold text-slate-700">{tenantSlug}</span>.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Invocations" value="12,500" icon={<Zap />} color="blue" />
        <MetricCard title="Avg Latency" value="842ms" icon={<BrainCircuit />} color="indigo" />
        <MetricCard title="Hallucination Rate" value="1.2%" icon={<ShieldAlert />} color="red" />
      </div>

      {/* Placeholder for the Funnel Chart */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400">
        <p>Funnel Chart Visualization will be rendered here.</p>
        <p className="text-sm mt-2">Powered by ClickHouse & Recharts</p>
      </div>
    </div>
  );
}

// Simple internal component for the cards
function MetricCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: "blue" | "indigo" | "red" }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}