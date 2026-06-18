"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCartStore } from "@/store/cart";
import { PAYMENT_METHODS } from "@/lib/data/mock-data";
import {
  formatCardCvv,
  formatCardExpiry,
  formatCardNumber,
  formatRwandaPhone,
  isCardPaymentValid,
  isValidRwandaPhone,
} from "@/lib/payment-input";
import {
  formatOrderDateTime,
  getReadyByTime,
  PREP_TIME_MINUTES,
} from "@/lib/order-rules";
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
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const pickupLabel =
    orderType === "pre-order" && pickupTime
      ? formatOrderDateTime(pickupTime)
      : undefined;

  const canPay =
    method === "card"
      ? isCardPaymentValid({ cardNumber, cardExpiry, cardCvv })
      : isValidRwandaPhone(phone);

  const handlePay = () => {
    if (!canPay) return;
    placeOrder(orderType, pickupTime);
    const params = new URLSearchParams({ type: orderType });
    if (pickupTime) params.set("pickup", pickupTime);
    if (orderType === "direct") params.set("readyBy", getReadyByTime().toISOString());
    router.push(`/checkout/success?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Payment</h1>
      <p className="text-xl font-bold">{formatRwf(getTotal())}</p>

      {orderType === "direct" ? (
        <p className="rounded-xl border border-hano-border bg-hano-primary-50 px-4 py-3 text-sm text-hano-green-500">
          Direct order · estimated prep time: <strong>{PREP_TIME_MINUTES} minutes</strong>
        </p>
      ) : (
        <p className="rounded-xl border border-hano-border bg-hano-primary-50 px-4 py-3 text-sm text-hano-green-500">
          Pre-order pickup at <strong>{pickupLabel}</strong>.
        </p>
      )}

      <div className="space-y-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left ${
              method === m.id ? "border-hano-green-500 bg-hano-green-500/5" : ""
            }`}
          >
            <Image src={m.logo} alt="" width={32} height={32} className="h-8 w-8 rounded-md object-cover" />
            <span className="font-medium">{m.name}</span>
          </button>
        ))}
      </div>

      {(method === "momo" || method === "airtel") && (
        <Input
          placeholder="Phone number (7XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(formatRwandaPhone(e.target.value))}
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
        />
      )}

      {method === "card" && (
        <div className="space-y-3">
          <Input
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={19}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
            />
            <Input
              placeholder="CVV"
              value={cardCvv}
              onChange={(e) => setCardCvv(formatCardCvv(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
            />
          </div>
        </div>
      )}

      <Button className="w-full" onClick={handlePay} disabled={!canPay}>
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
