"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/core/store/useAuthStore";
import { authService } from "@/core/services/auth.service";
import { Activity } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // If this fails (e.g., 401 Unauthorized), the interceptor we built in Phase 1 
        // will handle redirecting the user to /login. We just clear the state here.
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setUser]);

  // Optional: Show a full-screen branded loader while validating the session
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Activity className="w-10 h-10 text-blue-500 animate-pulse mb-4" />
        <p className="text-slate-400 font-medium">Initializing Workspace...</p>
      </div>
    );
  }

  return <>{children}</>;
}