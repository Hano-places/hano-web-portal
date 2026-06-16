"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatOrderDateTime } from "@/lib/order-rules";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { formatRwf, formatRelativeTime } from "@/lib/utils";

function OrdersList() {
  const getActiveOrders = useCartStore((s) => s.getActiveOrders);
  const getPreviousOrders = useCartStore((s) => s.getPreviousOrders);
  const clearPreviousOrders = useCartStore((s) => s.clearPreviousOrders);
  const reorder = useCartStore((s) => s.reorder);

  const activeOrders = getActiveOrders();
  const previousOrders = getPreviousOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <p className="text-sm text-hano-muted">Active and previous orders across places</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-hano-muted">
          Active orders
        </h2>
        {activeOrders.length === 0 ? (
          <p className="text-hano-muted">No active orders.</p>
        ) : (
          activeOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex cursor-pointer gap-4 rounded-xl border border-hano-border p-4 transition hover:border-hano-primary-300 hover:bg-hano-primary-50/40"
            >
              {order.placeImage ? (
                <Image src={order.placeImage} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              ) : null}
              <div className="flex-1">
                <p className="font-medium">{order.placeName}</p>
                <p className="text-sm text-hano-muted">{formatRelativeTime(order.date)}</p>
                <p className="text-sm">
                  {order.items.length} items · {formatRwf(order.total)}
                </p>
                <p className="text-xs text-hano-muted">
                  {order.orderType === "pre-order" && order.pickupTime
                    ? `Pickup ${formatOrderDateTime(order.pickupTime)}`
                    : order.readyBy
                      ? `Ready by ${formatOrderDateTime(order.readyBy)}`
                      : null}
                </p>
              </div>
              <span className="rounded-full bg-hano-primary-100 px-2 py-1 text-xs font-medium">
                {order.status}
              </span>
            </Link>
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-hano-muted">
            Previous orders
          </h2>
          {previousOrders.length > 0 ? (
            <button
              type="button"
              className="text-sm font-medium text-hano-muted transition-colors hover:text-hano-green-500"
              onClick={clearPreviousOrders}
            >
              Clear previous
            </button>
          ) : null}
        </div>
        {previousOrders.length === 0 ? (
          <p className="text-hano-muted">No previous orders.</p>
        ) : (
          previousOrders.map((order) => (
            <div
              key={order.id}
              className="flex gap-4 rounded-xl border border-hano-border p-4"
            >
              {order.placeImage ? (
                <Image src={order.placeImage} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              ) : null}
              <div className="flex-1">
                <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                  {order.placeName}
                </Link>
                <p className="text-sm text-hano-muted">{formatRelativeTime(order.date)}</p>
                <p className="text-sm">
                  {order.items.length} items · {formatRwf(order.total)}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => reorder(order.id)}>
                Reorder
              </Button>
            </div>
          ))
        )}
      </section>
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
