"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
      <div className="flex items-center w-96 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search traces, keys, or teammates..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <span>My Profile</span>
        </button>
      </div>
    </header>
  );
}