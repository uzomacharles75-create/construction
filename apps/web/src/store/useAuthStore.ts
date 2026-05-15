import { create } from 'zustand';

// We added 'persist' so that if you refresh the page, you stay logged in
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    role: 'owner' | 'staff' | 'admin' | 'client';
    company: string;
  } | null;
  login: (role: 'owner' | 'staff' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false, 
      user: null,

      login: (role) => {
        set({ 
          isAuthenticated: true, 
          user: { 
            name: role === 'owner' ? 'Banye Victor' : 'Engineer Sarah', 
            role: role, 
            company: 'Vertex Builders Ltd' 
          } 
        });
      },

      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'buildhub-auth' } // Saves session in browser storage
  )
);