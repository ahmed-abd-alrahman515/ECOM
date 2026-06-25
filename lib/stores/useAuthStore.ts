'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getMe, login as loginRequest, logout as logoutRequest, register as registerRequest } from '@/lib/api/auth';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/auth/token';
import type { LoginPayload, RegisterPayload, User } from '@/lib/types/api';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  fetchMe: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,
      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const auth = await loginRequest(payload);
          setStoredToken(auth.token);
          set({
            token: auth.token,
            user: auth.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            initialized: true,
          });
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to login.' });
          throw error;
        }
      },
      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const auth = await registerRequest(payload);
          setStoredToken(auth.token);
          set({
            token: auth.token,
            user: auth.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            initialized: true,
          });
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to register.' });
          throw error;
        }
      },
      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            initialized: true,
          });
        } catch (error) {
          get().clearAuthState();
          set({ isLoading: false, initialized: true, error: error instanceof Error ? error.message : 'Unable to load profile.' });
          throw error;
        }
      },
      hydrate: async () => {
        const token = getStoredToken() ?? get().token;

        if (!token) {
          set({ initialized: true, isAuthenticated: false, user: null, token: null, error: null });
          return;
        }

        set({ token, isAuthenticated: true, error: null });
        await get().fetchMe();
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutRequest();
        } finally {
          get().clearAuthState();
          set({ isLoading: false, initialized: true, error: null });
        }
      },
      clearAuthState: () => {
        clearStoredToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          initialized: true,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
