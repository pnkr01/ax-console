"use client";

import { Bell, Search, UserCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/core/store/useAuthStore";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
      <div className="flex items-center w-96 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow shadow-sm">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search traces, keys, or teammates..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900">{user.name || "Enterprise User"}</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.role || "Admin"}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </>
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          )}
        </div>
      </div>
    </header>
  );
}