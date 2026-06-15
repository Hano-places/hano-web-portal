"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Card } from "@/components/ui/card";

function OrderTypeSelect() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Order Type</h1>
      <Card
        className="cursor-pointer transition hover:border-hano-primary-500"
        onClick={() => router.push("/checkout/payment?type=direct")}
      >
        <p className="font-semibold">Direct Order</p>
        <p className="text-sm text-hano-muted">Order now and get served when you arrive</p>
      </Card>
      <Card
        className="cursor-pointer transition hover:border-hano-primary-500"
        onClick={() => router.push("/checkout/pickup-time")}
      >
        <p className="font-semibold">Pre Order (Reservation)</p>
        <p className="text-sm text-hano-muted">Schedule your pickup time in advance</p>
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
