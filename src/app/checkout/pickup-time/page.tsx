"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth/auth-guard";

function PickupTimeForm() {
  const router = useRouter();
  const [time, setTime] = useState("12:00");

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Pickup Time</h1>
      <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <Button
        className="w-full"
        onClick={() =>
          router.push(`/checkout/payment?type=pre-order&pickup=${encodeURIComponent(time)}`)
        }
      >
        Continue to payment
      </Button>
    </div>
  );
}

export default function PickupTimePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <PickupTimeForm />
      </div>
    </AuthGuard>
  );
}
