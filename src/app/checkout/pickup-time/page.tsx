"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  getPreOrderMaxTime,
  getPreOrderMinTime,
  toDateTimeLocalValue,
  validatePreOrderTime,
} from "@/lib/order-rules";

function PickupTimeForm() {
  const router = useRouter();
  const minValue = useMemo(() => toDateTimeLocalValue(getPreOrderMinTime()), []);
  const maxValue = useMemo(() => toDateTimeLocalValue(getPreOrderMaxTime()), []);
  const [value, setValue] = useState(minValue);
  const validation = validatePreOrderTime(value);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Pickup Time</h1>
      <p className="text-sm text-hano-muted">
        Choose when you want to pick up. Must be at least 30 minutes from now and within 24
        hours.
      </p>
      <input
        type="datetime-local"
        value={value}
        min={minValue}
        max={maxValue}
        onChange={(event) => setValue(event.target.value)}
        className="h-11 w-full rounded-xl border border-hano-border bg-white px-4 text-sm outline-none transition focus:border-hano-green-50 focus:bg-hano-primary-50"
      />
      {!validation.valid ? (
        <p className="text-sm text-hano-danger-500">{validation.error}</p>
      ) : null}
      <Button
        className="w-full"
        disabled={!validation.valid}
        onClick={() =>
          router.push(
            `/checkout/payment?type=pre-order&pickup=${encodeURIComponent(new Date(value).toISOString())}`,
          )
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
