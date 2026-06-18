"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export type AuthAction =
  | "add_to_cart"
  | "checkout"
  | "review"
  | "upload_moment"
  | "create_business"
  | "view_orders"
  | "view_profile"
  | "save_wishlist";

interface AuthGateContextValue {
  showLoginModal: boolean;
  pendingAction: AuthAction | null;
  returnTo: string | null;
  requireAuth: (action: AuthAction, returnTo?: string) => boolean;
  openLoginModal: (action?: AuthAction, returnTo?: string) => void;
  closeLoginModal: () => void;
}

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<AuthAction | null>(null);
  const [returnTo, setReturnTo] = useState<string | null>(null);

  const openLoginModal = useCallback((action?: AuthAction, path?: string) => {
    setPendingAction(action ?? null);
    setReturnTo(path ?? (typeof window !== "undefined" ? window.location.pathname : null));
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setPendingAction(null);
  }, []);

  const requireAuth = useCallback(
    (action: AuthAction, path?: string): boolean => {
      if (isAuthenticated) return true;

      const redirectActions: AuthAction[] = ["view_orders", "view_profile"];
      const currentPath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");

      if (redirectActions.includes(action)) {
        router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
        return false;
      }

      openLoginModal(action, currentPath);
      return false;
    },
    [isAuthenticated, openLoginModal, router],
  );

  return (
    <AuthGateContext.Provider
      value={{
        showLoginModal,
        pendingAction,
        returnTo,
        requireAuth,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used within AuthGateProvider");
  return ctx;
}

export function useRequireAuth() {
  const { requireAuth } = useAuthGate();
  return requireAuth;
}
