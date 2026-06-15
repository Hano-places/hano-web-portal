"use client";

import { useCartStore } from "@/store/cart";
import { WALLET_ACTIVITIES } from "@/lib/data/mock-data";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";

export default function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useCartStore((s) => s.orders);

  return (
    <div className="space-y-6">
      <Card className="bg-hano-primary-100">
        <p className="text-sm font-medium">Wallet coming soon</p>
        <p className="mt-1 text-xs text-hano-muted">
          Rewards and payments will be available in a future update.
        </p>
      </Card>

      <div>
        <p className="text-sm text-hano-muted">Total orders placed</p>
        <p className="text-3xl font-bold">{orders.length}</p>
      </div>

      <div>
        <p className="mb-2 text-sm text-hano-muted">{user?.name}</p>
        <p className="text-xs text-hano-muted">{user?.email}</p>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Activity</h2>
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
