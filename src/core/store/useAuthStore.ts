import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  activeTenantId: string | null;
  setUser: (user: User | null) => void;
  setTenant: (tenantId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activeTenantId: null,
  setUser: (user) => set({ user }),
  setTenant: (tenantId) => set({ activeTenantId: tenantId }),
  logout: () => set({ user: null, activeTenantId: null }),
}));