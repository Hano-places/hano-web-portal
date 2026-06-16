"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatOrderDateTime } from "@/lib/order-rules";
import { AuthGuard } from "@/components/auth/auth-guard";
import { formatRwf } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function OrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const orders = useCartStore((s) => s.orders);
  const reorder = useCartStore((s) => s.reorder);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <div className="space-y-4">
      <Link href="/orders" className="text-sm text-hano-muted hover:underline">
        ← Back to orders
      </Link>
      <div className="flex items-center gap-3">
        {order.placeImage ? (
          <Image
            src={order.placeImage}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl object-cover"
          />
        ) : null}
        <div>
          <h1 className="text-2xl font-bold">{order.placeName}</h1>
          <p className="text-sm text-hano-muted">{order.status}</p>
        </div>
      </div>
      <p className="text-sm text-hano-muted">
        {order.orderType === "pre-order" ? "Pre-order" : "Direct order"}
        {order.pickupTime ? ` · Pickup ${formatOrderDateTime(order.pickupTime)}` : ""}
        {order.readyBy ? ` · Ready by ${formatOrderDateTime(order.readyBy)}` : ""}
      </p>
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.qty}x {item.name}
            </span>
            <span>{formatRwf(item.priceRaw * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t pt-4 font-bold">
        <span>Total</span>
        <span>{formatRwf(order.total)}</span>
      </div>
      <Button variant="secondary" className="w-full" onClick={() => reorder(order.id)}>
        Reorder
      </Button>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-lg p-4">
        <OrderDetail />
      </div>
    </AuthGuard>
  );
}
