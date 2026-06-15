import type { UserResponse } from "@/lib/api/types";

export const BYPASS_ACCESS_TOKEN = "local-bypass-access";
export const BYPASS_REFRESH_TOKEN = "local-bypass-refresh";
export const BYPASS_USER_STORAGE_KEY = "@hano/bypassUser";

export const DEMO_EMAIL = "demo@hano.local";
export const DEMO_PASSWORD = "demo1234";

export function isAuthBypassEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";
}

export function isBypassToken(
  access: string | null | undefined,
  refresh: string | null | undefined,
): boolean {
  return access === BYPASS_ACCESS_TOKEN && refresh === BYPASS_REFRESH_TOKEN;
}

export function matchesDemoCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function createBypassUser(name?: string, email?: string): UserResponse {
  const now = new Date().toISOString();
  return {
    id: "local-bypass-user",
    name: name?.trim() || "Patrick Ihirwe",
    email: email?.trim().toLowerCase() || DEMO_EMAIL,
    emailVerified: true,
    image: null,
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadBypassUser(): UserResponse {
  if (typeof window === "undefined") return createBypassUser();
  try {
    const stored = localStorage.getItem(BYPASS_USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UserResponse;
  } catch {
    /* ignore */
  }
  return createBypassUser();
}

export function saveBypassUser(user: UserResponse) {
  localStorage.setItem(BYPASS_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearBypassUser() {
  localStorage.removeItem(BYPASS_USER_STORAGE_KEY);
}
