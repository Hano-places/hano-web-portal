"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { useAuthStore } from "@/store/auth";
import { HanoApiError } from "@/lib/api";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  isAuthBypassEnabled,
} from "@/lib/auth/bypass";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/home";
  const login = useAuthStore((s) => s.login);
  const enableBypassAuth = useAuthStore((s) => s.enableBypassAuth);
  const bypassEnabled = isAuthBypassEnabled();
  const [email, setEmail] = useState(bypassEnabled ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(bypassEnabled ? DEMO_PASSWORD : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(returnTo);
    } catch (err) {
      setError(err instanceof HanoApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-hano-border bg-white p-8 shadow-sm">
      <Link href="/" className="text-xl font-bold text-hano-green-500">
        Hano
      </Link>
      <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-hano-muted">Log in to your account</p>

      {bypassEnabled && (
        <div className="mt-4 rounded-xl border border-hano-primary-300 bg-hano-primary-50 p-3 text-sm">
          <p className="font-medium text-hano-green-500">Dev mode — API bypass active</p>
          <p className="mt-1 text-hano-muted">
            Use <span className="font-mono">{DEMO_EMAIL}</span> /{" "}
            <span className="font-mono">{DEMO_PASSWORD}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-hano-danger-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
        {bypassEnabled && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                await enableBypassAuth();
                router.push(returnTo);
              } catch {
                setError("Bypass login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            Quick demo login
          </Button>
        )}
      </form>

      <div className="mt-6">
        <SocialAuthButtons disabled={loading} />
      </div>

      <p className="mt-6 text-center text-sm text-hano-muted">
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={`/register?returnTo=${encodeURIComponent(returnTo)}`} className="font-medium underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
