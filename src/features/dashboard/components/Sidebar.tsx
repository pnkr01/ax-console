"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Key, Users, Settings, Filter, LogOut } from "lucide-react"; 
import clsx from "clsx";
import apiClient from "@/core/api/client"; 

interface SidebarProps {
  tenantSlug: string;
}

export function Sidebar({ tenantSlug }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: `/dashboard/${tenantSlug}/overview`, icon: LayoutDashboard },
    { name: "Funnels", href: `/dashboard/${tenantSlug}/funnels`, icon: Filter },
    { name: "API Keys", href: `/dashboard/${tenantSlug}/keys`, icon: Key },
    { name: "Team", href: `/dashboard/${tenantSlug}/team`, icon: Users },
    { name: "Settings", href: `/dashboard/${tenantSlug}/settings`, icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      window.location.assign("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="w-64 bg-[#0a0a0b] text-zinc-400 flex flex-col h-full border-r border-white/5 relative z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-[15px] tracking-wide text-zinc-100">AX Analytics</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">
          Workspace
        </div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-white/10 text-zinc-100" 
                  : "hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon className={clsx("w-[18px] h-[18px] mr-3 shrink-0 transition-colors", isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] mr-3 shrink-0" />
          Sign Out
        </button>
      </div>

      {/* Tenant Context Footer */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-white/[0.02]">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Current Tenant</p>
        <p className="text-sm font-medium text-zinc-200 truncate">{tenantSlug}</p>
        <div className="flex items-center mt-2.5">
          <div className="relative flex items-center justify-center w-2 h-2 mr-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-emerald-500 animate-ping"></span>
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-xs text-zinc-400">System Operational</span>
        </div>
      </div>
    </aside>
  );
}