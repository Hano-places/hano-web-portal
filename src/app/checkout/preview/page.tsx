"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatRwf } from "@/lib/utils";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Price } from "@/components/ui/price";

function CheckoutPreview() {
  const router = useRouter();
  const { items, getTotal, currentPlaceName, currentPlaceImage, clearCart } = useCartStore();
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const handleContinue = () => {
    router.push("/checkout/type");
  };

  const handleEdit = () => {
    router.push("/cart");
  };

  const handleDiscard = () => {
    clearCart();
    router.push("/places");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-hano-green-500/20 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-hano-border bg-white shadow-[0_18px_56px_rgba(0,0,0,0.12)]">
        <div className="border-b border-hano-border px-5 py-4">
          <h1 className="text-lg font-semibold text-hano-green-500">Order Preview</h1>
          <p className="mt-0.5 text-xs text-hano-muted">
            Confirm your items before continuing to checkout
          </p>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-hano-border bg-white p-3">
            {currentPlaceImage ? (
              <Image
                src={currentPlaceImage}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : null}
            <div>
              <p className="font-semibold text-hano-green-500">{currentPlaceName}</p>
              <p className="text-sm text-hano-muted">Single-place order</p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-hano-border bg-hano-white-200/60 p-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  {item.qty}x {item.name}
                </span>
                <Price>{formatRwf(item.priceRaw * item.qty)}</Price>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-hano-border pt-3 font-semibold">
              <span>Total</span>
              <Price className="text-base text-hano-green-500">{formatRwf(getTotal())}</Price>
            </div>
          </div>

          {confirmDiscard ? (
            <div className="rounded-xl border border-hano-danger-500/30 bg-red-50 px-3 py-2">
              <p className="text-sm font-medium text-hano-green-500">
                Discard this order draft?
              </p>
              <p className="mt-0.5 text-xs text-hano-muted">
                This will remove all items currently in your cart.
              </p>
              <div className="mt-2 flex flex-wrap justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setConfirmDiscard(false)}>
                  Keep editing
                </Button>
                <Button size="sm" variant="danger" onClick={handleDiscard}>
                  Yes, discard
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-hano-border bg-white px-5 py-3">
          <Button variant="ghost" onClick={() => setConfirmDiscard(true)}>
            Cancel order
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Edit order
          </Button>
          <Button variant="secondary" onClick={handleContinue}>
            Continue checkout
          </Button>
        </div>
      </div>
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
