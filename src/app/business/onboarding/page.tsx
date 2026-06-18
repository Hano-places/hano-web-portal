"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBusinessStore, defaultHours } from "@/store/business";

const STEPS = ["Basic info", "Location & contact", "Branding", "Hours", "Review"];

function OnboardingWizard() {
  const router = useRouter();
  const { draft, setDraft, completeOnboarding } = useBusinessStore();

  const next = () => setDraft({ step: draft.step + 1 });
  const back = () => setDraft({ step: Math.max(0, draft.step - 1) });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.step < STEPS.length - 1) {
      next();
      return;
    }
    completeOnboarding();
    router.push("/business/overview");
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="mb-6 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${i <= draft.step ? "bg-hano-primary-500" : "bg-hano-border"}`}
          />
        ))}
      </div>
      <h1 className="text-2xl font-bold">{STEPS[draft.step]}</h1>
      <p className="text-sm text-hano-muted">Step {draft.step + 1} of {STEPS.length}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {draft.step === 0 && (
          <>
            <Input
              placeholder="Business name"
              value={draft.name}
              onChange={(e) => setDraft({ name: e.target.value })}
              required
            />
            <Input
              placeholder="Category (e.g. Restaurant, Café)"
              value={draft.category}
              onChange={(e) => setDraft({ category: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={draft.description}
              onChange={(e) => setDraft({ description: e.target.value })}
              className="h-24 w-full rounded-xl border border-hano-border p-3 text-sm"
              required
            />
          </>
        )}

        {draft.step === 1 && (
          <>
            <Input
              placeholder="Address"
              value={draft.address}
              onChange={(e) => setDraft({ address: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={draft.phone}
              onChange={(e) => setDraft({ phone: e.target.value })}
              required
            />
            <Input
              placeholder="Website (optional)"
              value={draft.website}
              onChange={(e) => setDraft({ website: e.target.value })}
            />
            <Input
              placeholder="Instagram URL (optional)"
              value={draft.instagram}
              onChange={(e) => setDraft({ instagram: e.target.value })}
            />
            <Input
              placeholder="Facebook URL (optional)"
              value={draft.facebook}
              onChange={(e) => setDraft({ facebook: e.target.value })}
            />
          </>
        )}

        {draft.step === 2 && (
          <>
            <Input
              placeholder="Logo URL"
              value={draft.logoUrl}
              onChange={(e) => setDraft({ logoUrl: e.target.value })}
            />
            <Input
              placeholder="Banner URL"
              value={draft.bannerUrl}
              onChange={(e) => setDraft({ bannerUrl: e.target.value })}
            />
          </>
        )}

        {draft.step === 3 && (
          <div className="space-y-2">
            {Object.entries(draft.hours ?? defaultHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-2 text-sm capitalize">
                <span className="w-24">{day}</span>
                <Input
                  type="time"
                  value={hours.open}
                  onChange={(e) =>
                    setDraft({
                      hours: {
                        ...draft.hours,
                        [day]: { ...hours, open: e.target.value },
                      },
                    })
                  }
                  className="flex-1"
                />
                <span>–</span>
                <Input
                  type="time"
                  value={hours.close}
                  onChange={(e) =>
                    setDraft({
                      hours: {
                        ...draft.hours,
                        [day]: { ...hours, close: e.target.value },
                      },
                    })
                  }
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        )}

        {draft.step === 4 && (
          <div className="space-y-2 rounded-xl border p-4 text-sm">
            <p><strong>Name:</strong> {draft.name}</p>
            <p><strong>Category:</strong> {draft.category}</p>
            <p><strong>Address:</strong> {draft.address}</p>
            <p><strong>Phone:</strong> {draft.phone}</p>
          </div>
        )}

        <div className="flex gap-3">
          {draft.step > 0 && (
            <Button type="button" variant="outline" onClick={back}>
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1">
            {draft.step === STEPS.length - 1 ? "Complete setup" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function BusinessOnboardingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-hano-surface px-4">
        <OnboardingWizard />
      </div>
    </AuthGuard>
  );
}
