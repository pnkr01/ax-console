"use client";

import { Bell, Search, Loader2 } from "lucide-react";
import { useAuthStore } from "@/core/store/useAuthStore";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-zinc-200/80 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center w-96 bg-zinc-100/50 border border-zinc-200/80 rounded-xl px-3 py-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-900/5 focus-within:border-zinc-300 transition-all duration-200">
        <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder="Search traces, keys, or teammates..." 
          className="bg-transparent border-none outline-none text-sm w-full text-zinc-800 placeholder:text-zinc-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-zinc-400 hover:text-zinc-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0.5 w-2 h-2 border-2 border-white bg-blue-500 rounded-full"></span>
        </button>
        
        <div className="w-px h-6 bg-zinc-200"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          {user ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[13px] font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{user.name || "Enterprise User"}</span>
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{user.role || "Admin"}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </>
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          )}
        </div>
      </div>
    </header>
  );
}