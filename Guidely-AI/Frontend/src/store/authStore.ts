import { create } from "zustand";
import type { User } from "@/types";
import { loginApi, signupApi, logoutApi, getMeApi, refreshTokenApi } from "@/services/auth";
import type { LoginRequest, SignupRequest } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isInitialized: false,

  login: async (data) => {
    set({ isLoading: true });
    try {
      const result = await loginApi(data);
      localStorage.setItem("accessToken", result.accessToken);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const result = await signupApi(data);
      localStorage.setItem("accessToken", result.accessToken);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — clear local state regardless
    }
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },

  initialize: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const user = await getMeApi(token);
      set({ user, accessToken: token, isInitialized: true });
    } catch {
      // Token expired — try refresh
      try {
        const result = await refreshTokenApi();
        localStorage.setItem("accessToken", result.accessToken);
        set({
          user: result.user,
          accessToken: result.accessToken,
          isInitialized: true,
        });
      } catch {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isInitialized: true });
      }
    }
  },

  setToken: (token) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },
}));
