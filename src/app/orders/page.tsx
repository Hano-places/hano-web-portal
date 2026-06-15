"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { AuthGuard } from "@/components/auth/auth-guard";
import { formatRwf, formatRelativeTime } from "@/lib/utils";

function OrdersList() {
  const orders = useCartStore((s) => s.orders);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Orders</h1>
      {orders.length === 0 && (
        <p className="text-hano-muted">No orders yet.</p>
      )}
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="flex gap-4 rounded-xl border border-hano-border p-4 transition hover:shadow-sm"
        >
          {order.placeImage && (
            <Image src={order.placeImage} alt="" width={64} height={64} className="rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <p className="font-medium">{order.placeName}</p>
            <p className="text-sm text-hano-muted">{formatRelativeTime(order.date)}</p>
            <p className="text-sm">{order.items.length} items · {formatRwf(order.total)}</p>
          </div>
          <span className="rounded-full bg-hano-primary-100 px-2 py-1 text-xs font-medium">
            {order.status}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl p-4">
        <OrdersList />
      </div>
    </AuthGuard>
  );
}
