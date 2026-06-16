"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  formatOrderDateTime,
  getReadyByTime,
  PREP_TIME_MINUTES,
} from "@/lib/order-rules";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Card } from "@/components/ui/card";

function OrderTypeSelect() {
  const router = useRouter();
  const readyBy = formatOrderDateTime(getReadyByTime());

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Order Type</h1>
      <Card interactive onClick={() => router.push("/checkout/payment?type=direct")}>
        <p className="font-semibold">Direct Order</p>
        <p className="text-sm text-hano-muted">
          We&apos;ll start preparing now. Estimated ready by {readyBy} (
          {PREP_TIME_MINUTES} min prep time).
        </p>
      </Card>
      <Card interactive onClick={() => router.push("/checkout/pickup-time")}>
        <p className="font-semibold">Pre Order (Reservation)</p>
        <p className="text-sm text-hano-muted">
          Pick a time at least {PREP_TIME_MINUTES} minutes from now and within 24 hours.
        </p>
      </Card>
    </div>
  );
}

export default function OrderTypePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <OrderTypeSelect />
      </div>
    </AuthGuard>
  );
}
