"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserPlus, ShieldAlert, Loader2 } from "lucide-react";
import { teamService } from "@/core/services/team.service";

export default function TeamPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = use(params);
  // Optional: State for managing an Invite Modal (similar to CreateKeyModal)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team', tenantSlug],
    queryFn: () => teamService.getMembers(tenantSlug),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-slate-400" /> Team Management
          </h1>
          <p className="text-slate-500 mt-1">Manage access control for <span className="font-semibold">{tenantSlug}</span>.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                    </td>
                </tr>
            ) : members.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No team members found. Invite colleagues to collaborate.
                    </td>
                </tr>
            ) : (
                members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            member.role === 'OWNER' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            member.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                            {member.role === 'OWNER' && <ShieldAlert className="w-3 h-3" />}
                            {member.role}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        member.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500'}`}></span> 
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1).toLowerCase()}
                    </span>
                    </td>
                    <td className="px-6 py-4">{new Date(member.joined_at).toLocaleDateString()}</td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* TODO: Add an <InviteMemberModal /> similar to CreateKeyModal */}
    </div>
  );
}