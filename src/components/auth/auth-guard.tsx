"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (requireOnboarding && user?.onboardingCompleted === false) {
      router.replace("/onboarding/profile");
    }
  }, [isLoading, isAuthenticated, user, router, requireOnboarding]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-hano-green-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

export function BusinessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuthStore();
  const profile = useBusinessStore((s) => s.profile);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?returnTo=/business/overview");
      return;
    }
    if (!profile) {
      router.replace("/business/create");
    }
  }, [isLoading, isAuthenticated, profile, router]);

  if (isLoading || !isAuthenticated || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-hano-green-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
