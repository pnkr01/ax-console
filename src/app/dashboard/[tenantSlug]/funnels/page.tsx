"use client";

import { use, useState } from "react"; // ADDED: import 'use'
import { Filter, Plus, Trash2, Play, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AVAILABLE_EVENTS = [
  "agent_initialized",
  "voice_input_received",
  "intent_extracted",
  "tool_execution_started",
  "tool_execution_success",
  "tool_execution_failed",
  "action_scheduled",
];

const mockQueryResult = [
  { step: "1. voice_input_received", count: 15420, color: "#3b82f6" },
  { step: "2. intent_extracted", count: 12100, color: "#60a5fa" },
  { step: "3. tool_execution_started", count: 9850, color: "#93c5fd" },
  { step: "4. tool_execution_success", count: 7120, color: "#bfdbfe" },
];

// UPDATED: params is typed as a Promise
export default function FunnelsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  // FIXED: Unwrap the params promise using React's use() hook
  const { tenantSlug } = use(params);
  
  const [querySteps, setQuerySteps] = useState<string[]>([
    "voice_input_received",
    "intent_extracted"
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState<{ step: string; count: number; color: string }[]>([]);

  const addStep = () => {
    setQuerySteps([...querySteps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...querySteps];
    newSteps[index] = value;
    setQuerySteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = querySteps.filter((_, i) => i !== index);
    setQuerySteps(newSteps);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setChartData(mockQueryResult);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Filter className="w-8 h-8 text-slate-400" /> Funnel Analysis
        </h1>
        <p className="text-slate-500 mt-1">Map the execution path for <span className="font-semibold">{tenantSlug}</span>.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                  >
                    <option value="" disabled>Select an event...</option>
                    {AVAILABLE_EVENTS.map(ev => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                  {querySteps.length > 2 && (
                    <button onClick={() => removeStep(index)} className="text-slate-400 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={addStep}
              className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={handleRunQuery}
                disabled={isRunning || querySteps.includes("")}
                className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {isRunning ? "Computing..." : <><Play className="w-4 h-4" /> Run Query</>}
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full min-h-[500px] flex flex-col">
            <h2 className="font-semibold text-slate-900 mb-6">Conversion Funnel</h2>
            
            {chartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Filter className="w-12 h-12 mb-3 opacity-20" />
                <p>Build your query and click run to visualize.</p>
              </div>
            ) : (
              <>
                <div className="mb-8" style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="step" type="category" width={180} stroke="#475569" fontSize={12} fontWeight={500} tickFormatter={(val) => val.substring(3)} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value} traces`, "Count"]}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-auto bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <Activity className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">Highest Drop-off Detected</h4>
                    <p className="text-sm text-amber-800 mt-1">
                    You are losing <strong>27.6%</strong> of traces between <code>tool_execution_started</code> and <code>tool_execution_success</code>. Check your LLM provider&apos;s rate limits or tool timeouts.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}