import { apiRequest } from "./client";
import type { AuthResponse, RefreshResponse } from "./types";

export type OAuthProvider = "google" | "apple";

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>("/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      skipAuth: true,
    }),

  login: (email: string, password: string) =>
    apiRequest<AuthResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  refresh: (refreshToken: string) =>
    apiRequest<RefreshResponse>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    }),

  logoutDevices: () =>
    apiRequest<{ message: string }>("/v1/auth/logout-devices", { method: "POST" }),

  socialLogin: (provider: OAuthProvider, idToken: string) =>
    apiRequest<AuthResponse>(`/v1/auth/oauth/${provider}`, {
      method: "POST",
      body: JSON.stringify({ idToken }),
      skipAuth: true,
    }),
};
