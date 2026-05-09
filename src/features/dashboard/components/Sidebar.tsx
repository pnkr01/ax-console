"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// 1. IMPORT LogOut icon
import { Activity, LayoutDashboard, Key, Users, Settings, Filter, LogOut } from "lucide-react"; 
import clsx from "clsx";
// 2. IMPORT your API client
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

  // 3. ADD the logout handler
  const handleLogout = async () => {
    try {
      // Calls the Go backend to destroy the HttpOnly cookie
      await apiClient.post("/auth/logout");
      // Hard redirect to the login page so Next.js Middleware registers the change
      window.location.assign("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 shrink-0">
        <Activity className="w-6 h-6 text-blue-500 mr-2 shrink-0" />
        <span className="font-bold text-lg tracking-wider text-white">AX ANALYTICS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
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
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={clsx("w-5 h-5 mr-3 shrink-0", isActive ? "text-blue-200" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 4. ADD Logout Button right above the footer */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 shrink-0" />
          Sign Out
        </button>
      </div>

      {/* Tenant Context Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Tenant</p>
        <p className="text-sm font-medium text-white truncate" title={tenantSlug}>{tenantSlug}</p>
        <div className="flex items-center mt-2">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0"></span>
          <span className="text-xs text-slate-400">System Operational</span>
        </div>
      </div>
    </aside>
  );
}