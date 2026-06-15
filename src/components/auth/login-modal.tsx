"use client";

import { useAuthGate } from "@/hooks/use-require-auth";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  const { showLoginModal, returnTo, closeLoginModal } = useAuthGate();

  if (!showLoginModal) return null;

  const loginHref = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  const registerHref = `/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-hano-surface"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-hano-green-500">Sign in to continue</h2>
        <p className="mt-2 text-sm text-hano-muted">
          Create an account or log in to complete this action.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href={loginHref} onClick={closeLoginModal}>
            <Button className="w-full">Log in</Button>
          </Link>
          <Link href={registerHref} onClick={closeLoginModal}>
            <Button variant="secondary" className="w-full">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
