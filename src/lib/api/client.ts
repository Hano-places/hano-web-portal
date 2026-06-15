import { BASE_URL } from "./types";
import {
  BYPASS_ACCESS_TOKEN,
  BYPASS_REFRESH_TOKEN,
} from "@/lib/auth/bypass";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@hano/accessToken",
  REFRESH_TOKEN: "@hano/refreshToken",
} as const;

export class HanoApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HanoApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let _onLogout: (() => void) | null = null;

export function registerLogoutCallback(cb: () => void) {
  _onLogout = cb;
}

function getTokens() {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  };
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function clearStoredTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

async function attemptRefresh(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    return null;
  }
}

async function parseError(res: Response): Promise<HanoApiError> {
  try {
    const json = await res.json();
    const msg =
      json?.error?.message ?? json?.message ?? json?.error ?? `HTTP ${res.status}`;
    const code = json?.error?.code ?? "UNKNOWN";
    return new HanoApiError(res.status, code, String(msg), json?.error?.details);
  } catch {
    return new HanoApiError(res.status, "UNKNOWN", `HTTP ${res.status}`);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
  _isRetry = false,
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };

  const { accessToken } = getTokens();
  const isLocalBypassToken = accessToken === BYPASS_ACCESS_TOKEN;

  if (!skipAuth && accessToken && !isLocalBypassToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && !_isRetry && !skipAuth) {
    const { refreshToken } = getTokens();
    if (
      accessToken === BYPASS_ACCESS_TOKEN ||
      refreshToken === BYPASS_REFRESH_TOKEN
    ) {
      throw new HanoApiError(
        401,
        "UNAUTHORIZED",
        "Unauthorized in local bypass mode.",
      );
    }
    if (refreshToken) {
      const newAccess = await attemptRefresh(refreshToken);
      if (newAccess) {
        return apiRequest<T>(path, options, true);
      }
    }
    _onLogout?.();
    throw new HanoApiError(401, "UNAUTHORIZED", "Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiMultipart<T>(path: string, body: FormData): Promise<T> {
  const { accessToken } = getTokens();
  const headers: Record<string, string> = {};
  if (accessToken && accessToken !== BYPASS_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, unknown>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

export { buildQuery };
