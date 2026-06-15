"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatRwf } from "@/lib/utils";
import { AuthGuard } from "@/components/auth/auth-guard";

function CheckoutPreview() {
  const router = useRouter();
  const { items, getTotal, currentPlaceName } = useCartStore();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Order Preview</h1>
      <p className="text-sm text-hano-muted">{currentPlaceName}</p>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>
            {item.qty}x {item.name}
          </span>
          <span>{formatRwf(item.priceRaw * item.qty)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t pt-4 font-bold">
        <span>Total</span>
        <span>{formatRwf(getTotal())}</span>
      </div>
      <Button className="w-full" onClick={() => router.push("/checkout/type")}>
        Continue
      </Button>
    </div>
  );
}

export default function CheckoutPreviewPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <CheckoutPreview />
      </div>
    </AuthGuard>
  );
}
