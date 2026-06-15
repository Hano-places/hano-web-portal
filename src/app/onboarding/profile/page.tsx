"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthStore } from "@/store/auth";

function OnboardingForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({ name, onboardingCompleted: true });
      router.push("/home");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-hano-border bg-white p-8">
      <h1 className="text-2xl font-bold">Complete your profile</h1>
      <p className="mt-1 text-sm text-hano-muted">Step {step + 1} of 2</p>

      {step === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(1);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Display name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={handleComplete} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={275}
              className="h-24 w-full rounded-xl border border-hano-border p-3 text-sm outline-none focus:border-hano-green-500"
              placeholder="Tell us about yourself..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Get started"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hano-surface p-4">
      <AuthGuard requireOnboarding={false}>
        <OnboardingForm />
      </AuthGuard>
    </div>
  );
}
