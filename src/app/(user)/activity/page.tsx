"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { WALLET_ACTIVITIES } from "@/lib/data/mock-data";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";

export default function ActivityPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useCartStore((s) => s.orders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Activity</h1>
        <p className="text-sm text-hano-muted">Orders, rewards, and wallet activity</p>
      </div>

      <Card className="bg-hano-primary-100">
        <p className="text-sm font-medium">Wallet coming soon</p>
        <p className="mt-1 text-xs text-hano-muted">
          Rewards and payments will be available in a future update.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-hano-muted">Total orders</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-hano-muted">Reward points</p>
          <p className="text-3xl font-bold">400</p>
        </Card>
        <Card>
          <p className="text-sm text-hano-muted">Account</p>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-hano-muted">{user?.email}</p>
        </Card>
      </div>

      {orders.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">Recent Orders</h2>
          <div className="space-y-2">
            {orders.map((order) => (
              <Card key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-hano-muted">{order.placeName}</p>
                </div>
                <Link href={`/orders/${order.id}`} className="text-sm text-hano-muted hover:underline">
                  View
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Activity Timeline</h2>
        <div className="space-y-2">
          {WALLET_ACTIVITIES.map((a) => (
            <Card key={a.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-hano-muted">{a.date}</p>
              </div>
              <span className={a.type === "credit" ? "text-hano-success" : ""}>{a.amount}</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
