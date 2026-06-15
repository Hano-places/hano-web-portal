"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth";
import { AuthGateProvider } from "@/hooks/use-require-auth";
import { LoginModal } from "@/components/auth/login-modal";

function AuthInitializer({ children }: { children: ReactNode }) {
  const loadTokens = useAuthStore((s) => s.loadTokens);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGateProvider>
        <AuthInitializer>
          {children}
          <LoginModal />
        </AuthInitializer>
      </AuthGateProvider>
    </QueryClientProvider>
  );
}
