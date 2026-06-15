"use client";

import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useBusinessStore } from "@/store/business";

function CreateBusinessContent() {
  const router = useRouter();
  const profile = useBusinessStore((s) => s.profile);

  if (profile) {
    router.replace("/business/overview");
    return null;
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card className="text-center">
        <Icon name="building" size={48} className="mx-auto text-hano-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Create a business account</h1>
        <p className="mt-2 text-sm text-hano-muted">
          Use the same Hano credentials to manage your restaurant, café, or lounge.
          You&apos;ll complete a short onboarding with your business details.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/business/onboarding")}>
          Get started
        </Button>
      </Card>
    </div>
  );
}

export default function CreateBusinessPage() {
  return (
    <AuthGuard>
      <CreateBusinessContent />
    </AuthGuard>
  );
}
