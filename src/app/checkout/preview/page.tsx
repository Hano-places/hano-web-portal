"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatRwf } from "@/lib/utils";
import { AuthGuard } from "@/components/auth/auth-guard";

function CheckoutPreview() {
  const router = useRouter();
  const { items, getTotal, currentPlaceName, currentPlaceImage } = useCartStore();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Order Preview</h1>
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
      <Link href="/cart" className="block text-center text-sm text-hano-muted hover:underline">
        View full cart
      </Link>
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
