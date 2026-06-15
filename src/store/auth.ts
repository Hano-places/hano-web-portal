import { create } from "zustand";
import { authApi } from "@/lib/api/auth";
import { clearStoredTokens, registerLogoutCallback, STORAGE_KEYS } from "@/lib/api/client";
import { usersApi } from "@/lib/api/users";
import type { UserResponse } from "@/lib/api/types";
import {
  BYPASS_ACCESS_TOKEN,
  BYPASS_REFRESH_TOKEN,
  clearBypassUser,
  createBypassUser,
  isAuthBypassEnabled,
  isBypassToken,
  loadBypassUser,
  matchesDemoCredentials,
  saveBypassUser,
} from "@/lib/auth/bypass";

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  loadTokens: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: {
    name?: string;
    image?: string;
    onboardingCompleted?: boolean;
  }) => Promise<void>;
  setUser: (user: UserResponse) => void;
  enableBypassAuth: (name?: string, email?: string) => Promise<void>;
}

async function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

async function enableBypassSession(name?: string, email?: string) {
  const user = createBypassUser(name, email);
  saveBypassUser(user);
  await saveTokens(BYPASS_ACCESS_TOKEN, BYPASS_REFRESH_TOKEN);
  return user;
}

export const useAuthStore = create<AuthState>((set, get) => {
  registerLogoutCallback(() => {
    clearStoredTokens();
    clearBypassUser();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  });

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,

    loadTokens: async () => {
      set({ isLoading: true });
      try {
        const access = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (access && refresh) {
          if (isBypassToken(access, refresh)) {
            const user = loadBypassUser();
            set({ accessToken: access, refreshToken: refresh, user, isAuthenticated: true });
            return;
          }
          const user = await usersApi.getMe();
          set({ accessToken: access, refreshToken: refresh, user, isAuthenticated: true });
        }
      } catch {
        clearStoredTokens();
        clearBypassUser();
      } finally {
        set({ isLoading: false });
      }
    },

    login: async (email, password) => {
      if (isAuthBypassEnabled() && matchesDemoCredentials(email, password)) {
        const user = await enableBypassSession(undefined, email);
        set({
          user,
          accessToken: BYPASS_ACCESS_TOKEN,
          refreshToken: BYPASS_REFRESH_TOKEN,
          isAuthenticated: true,
        });
        return;
      }

      const data = await authApi.login(email, password);
      clearBypassUser();
      await saveTokens(data.accessToken, data.refreshToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      });
    },

    signup: async (name, email, password) => {
      if (isAuthBypassEnabled()) {
        const user = await enableBypassSession(name, email);
        set({
          user,
          accessToken: BYPASS_ACCESS_TOKEN,
          refreshToken: BYPASS_REFRESH_TOKEN,
          isAuthenticated: true,
        });
        return;
      }

      const data = await authApi.signup(name, email, password);
      clearBypassUser();
      await saveTokens(data.accessToken, data.refreshToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      });
    },

    logout: async () => {
      const { accessToken } = get();
      if (!isBypassToken(accessToken, get().refreshToken)) {
        try {
          await authApi.logoutDevices();
        } catch {
          /* ignore */
        }
      }
      clearStoredTokens();
      clearBypassUser();
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    },

    updateUser: async (patch) => {
      const { user, accessToken, refreshToken } = get();
      if (!user) return;

      if (isBypassToken(accessToken, refreshToken)) {
        const updated = { ...user, ...patch, updatedAt: new Date().toISOString() };
        saveBypassUser(updated);
        set({ user: updated });
        return;
      }

      const updated = await usersApi.updateProfile(user.id, patch);
      set({ user: updated });
    },

    setUser: (user) => set({ user }),

    enableBypassAuth: async (name, email) => {
      const user = await enableBypassSession(name, email);
      set({
        user,
        accessToken: BYPASS_ACCESS_TOKEN,
        refreshToken: BYPASS_REFRESH_TOKEN,
        isAuthenticated: true,
      });
    },
  };
});
