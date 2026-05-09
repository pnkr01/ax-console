"use client";

import { use, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Filter, Plus, Trash2, Play, Activity, AlertCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { analyticsService, FunnelResult } from "@/core/services/analytics.service";

const AVAILABLE_EVENTS = [
  "agent_initialized",
  "voice_input_received",
  "intent_extracted",
  "tool_execution_started",
  "tool_execution_success",
  "tool_execution_failed",
  "action_scheduled",
];

export default function FunnelsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = use(params);
  const [querySteps, setQuerySteps] = useState<string[]>(["voice_input_received", "intent_extracted"]);
  
  // Use Mutation instead of Query because this is a user-triggered POST action
  const { mutate: runQuery, data: chartData, isPending, isError } = useMutation({
    mutationFn: (steps: string[]) => analyticsService.runFunnelQuery(tenantSlug, steps),
  });

  const updateStep = (index: number, value: string) => {
    const newSteps = [...querySteps];
    newSteps[index] = value;
    setQuerySteps(newSteps);
  };

  const removeStep = (index: number) => setQuerySteps(querySteps.filter((_, i) => i !== index));
  const addStep = () => setQuerySteps([...querySteps, ""]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Filter className="w-8 h-8 text-slate-400" /> Funnel Analysis
        </h1>
        <p className="text-slate-500 mt-1">Map the execution path for <span className="font-semibold">{tenantSlug}</span>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Query Builder */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Build Query
            </h2>
            
            <div className="space-y-4">
              {querySteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                    {index + 1}
                  </div>
                  <select 
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 outline-none p-2.5 transition-all shadow-sm"
                  >
                    <option value="" disabled>Select an event...</option>
                    {AVAILABLE_EVENTS.map(ev => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                  {querySteps.length > 2 && (
                    <button onClick={() => removeStep(index)} className="text-slate-400 hover:text-red-500 transition p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={addStep}
              className="mt-4 text-sm text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800 transition"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={() => runQuery(querySteps)}
                disabled={isPending || querySteps.includes("")}
                className="w-full bg-slate-900 text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition shadow-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} 
                {isPending ? "Computing..." : "Run Query"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full min-h-[500px] flex flex-col">
            <h2 className="font-semibold text-slate-900 mb-6">Conversion Funnel</h2>
            
            {isError && (
               <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                   <AlertCircle className="w-4 h-4" /> Failed to compute funnel data.
               </div>
            )}

            {!chartData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Filter className="w-12 h-12 mb-3 opacity-20" />
                <p>Build your query and click run to visualize.</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex-1" style={{ width: '100%', minHeight: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="step" type="category" width={180} stroke="#475569" fontSize={12} fontWeight={500} tickFormatter={(val) => val.replace(/_/g, ' ')} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value} traces`, "Count"]}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartData.map((entry: FunnelResult, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}