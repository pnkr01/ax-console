"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Plus, Trash2, Shield, Loader2, AlertCircle } from "lucide-react";
import { CreateKeyModal } from "@/features/keys/components/CreateKeyModal";
import { keyService } from "@/core/services/key.service";

export default function ApiKeysPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = use(params);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Keys
  const { data: keys = [], isLoading, isError } = useQuery({
    queryKey: ['api-keys', tenantSlug],
    queryFn: () => keyService.getKeys(tenantSlug),
  });

  // Revoke Key Mutation
  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => keyService.revokeKey(tenantSlug, keyId),
    onSuccess: () => {
      // Invalidate the cache to trigger an automatic re-fetch
      queryClient.invalidateQueries({ queryKey: ['api-keys', tenantSlug] });
    },
  });

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

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex gap-4 items-start shadow-sm">
        <Shield className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">Enterprise Security Enforced</h4>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            All API keys are cryptographically hashed using SHA-256 before storage in PostgreSQL. 
            Raw keys are synced directly to our Redis edge for zero-latency authorization. We cannot recover lost keys.
          </p>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium text-sm">Failed to load API keys. Please refresh the page.</p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Prefix</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Last Used</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                    </td>
                </tr>
            ) : keys.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No API keys found. Create one to start ingesting telemetry.
                    </td>
                </tr>
            ) : (
                keys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{key.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{key.prefix}••••••••</td>
                    <td className="px-6 py-4">{new Date(key.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</td>
                    <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        key.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${key.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span> 
                        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => revokeMutation.mutate(key.id)}
                        disabled={key.status === 'revoked' || revokeMutation.isPending}
                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Revoke Key"
                    >
                        {revokeMutation.isPending && revokeMutation.variables === key.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <CreateKeyModal 
        tenantSlug={tenantSlug} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['api-keys', tenantSlug] })}
      />
    </div>
  );
}