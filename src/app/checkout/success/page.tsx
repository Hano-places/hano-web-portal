"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatOrderDateTime } from "@/lib/order-rules";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderType = searchParams.get("type") ?? "direct";
  const pickup = searchParams.get("pickup");
  const readyBy = searchParams.get("readyBy");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="text-5xl">✓</div>
      <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
      <p className="mt-2 text-hano-muted">Your order has been submitted successfully.</p>
      {orderType === "direct" && readyBy ? (
        <p className="mt-3 text-sm text-hano-green-500">
          Estimated ready by {formatOrderDateTime(readyBy)}
        </p>
      ) : null}
      {orderType === "pre-order" && pickup ? (
        <p className="mt-3 text-sm text-hano-green-500">
          Pickup scheduled for {formatOrderDateTime(pickup)}
        </p>
      ) : null}
      <div className="mt-8 flex gap-3">
        <Link href="/orders">
          <Button variant="outline">View orders</Button>
        </Link>
        <Link href="/home">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <AuthGuard>
      <Suspense>
        <SuccessContent />
      </Suspense>
    </AuthGuard>
  );
}
