"use client";

import { use, useState } from "react"; // ADDED: import 'use'
import { Key, Plus, MoreVertical, Shield } from "lucide-react";
import { CreateKeyModal } from "@/features/keys/components/CreateKeyModal";

const mockKeys = [
  { id: "1", name: "Production Core Agent", prefix: "ax_live_", createdAt: "2026-05-01", status: "active", lastUsed: "2 mins ago" },
  { id: "2", name: "Staging Test Key", prefix: "ax_live_", createdAt: "2026-04-15", status: "active", lastUsed: "1 day ago" },
];

// UPDATED: params is typed as a Promise
export default function ApiKeysPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  // FIXED: Unwrap the params promise using React's use() hook
  const { tenantSlug } = use(params);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = () => {
    console.log("Refreshing table data...");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Key className="w-8 h-8 text-slate-400" /> API Keys
          </h1>
          <p className="text-slate-500 mt-1">Manage ingestion keys for <span className="font-semibold">{tenantSlug}</span>.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create New Key
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex gap-4 items-start">
        <Shield className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">Enterprise Security Enforced</h4>
          <p className="text-slate-600 text-sm mt-1">
            All API keys are cryptographically hashed using SHA-256 before storage in PostgreSQL. 
            Raw keys are synced directly to our Redis edge for zero-latency authorization. We cannot recover lost keys.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Prefix</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Last Used</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockKeys.map((key) => (
              <tr key={key.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{key.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{key.prefix}••••••••</td>
                <td className="px-6 py-4">{key.createdAt}</td>
                <td className="px-6 py-4">{key.lastUsed}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {mockKeys.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No API keys found. Create one to start ingesting telemetry.
          </div>
        )}
      </div>

      <CreateKeyModal 
        tenantSlug={tenantSlug} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleRefresh}
      />
    </div>
  );
}