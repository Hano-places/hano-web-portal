"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCartStore } from "@/store/cart";
import { PAYMENT_METHODS } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/auth/auth-guard";
import { formatRwf } from "@/lib/utils";

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderType = (searchParams.get("type") ?? "direct") as "direct" | "pre-order";
  const pickupTime = searchParams.get("pickup") ?? undefined;
  const { getTotal, placeOrder } = useCartStore();
  const [method, setMethod] = useState("momo");
  const [phone, setPhone] = useState("");

  const handlePay = () => {
    placeOrder(orderType, pickupTime);
    router.push("/checkout/success");
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Payment</h1>
      <p className="text-xl font-bold">{formatRwf(getTotal())}</p>

      <div className="space-y-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${
              method === m.id ? "border-hano-primary-500 bg-hano-primary-50" : ""
            }`}
          >
            <span>{m.icon}</span>
            <span className="font-medium">{m.name}</span>
          </button>
        ))}
      </div>

      {(method === "momo" || method === "airtel") && (
        <Input
          placeholder="Phone number (7XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      {method === "card" && (
        <div className="space-y-3">
          <Input placeholder="Card number" />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="MM/YY" />
            <Input placeholder="CVV" />
          </div>
        </div>
      )}

      <Button className="w-full" onClick={handlePay}>
        Pay {formatRwf(getTotal())}
      </Button>
      <p className="text-center text-xs text-hano-muted">
        Payment processing is UI-only until backend integration.
      </p>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <Suspense>
          <PaymentForm />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
