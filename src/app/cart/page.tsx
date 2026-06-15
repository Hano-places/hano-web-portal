"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatRwf } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { items, updateQty, removeItem, getTotal, getItemCount } = useCartStore();

  if (!requireAuth("checkout")) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-hano-muted">Your cart is empty</p>
        <Link href="/explore" className="mt-4 inline-block text-sm underline">
          Explore places
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Cart ({getItemCount()})</h1>
      {items.map((item) => (
        <div key={item.id} className="flex gap-3 rounded-xl border p-3">
          <Image src={item.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-hano-muted">{item.placeName}</p>
            <p className="font-semibold">{item.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} className="h-8 w-8 rounded-lg border">
              -
            </button>
            <span>{item.qty}</span>
            <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="h-8 w-8 rounded-lg border">
              +
            </button>
          </div>
          <button type="button" onClick={() => removeItem(item.id)} className="text-sm text-hano-danger-500">
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold">{formatRwf(getTotal())}</span>
      </div>
      <Button className="w-full" onClick={() => router.push("/checkout/preview")}>
        Confirm order
      </Button>
    </div>
  );
}
