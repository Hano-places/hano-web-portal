"use client";

import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RecentOrder } from "@/lib/business/mock-data";

export function RecentOrdersList({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card>
      <CardTitle>Recent Orders</CardTitle>
      <ul className="mt-4 space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="flex items-center gap-3">
            <Image
              src={order.customerAvatar}
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Order {order.orderNumber}</p>
              <p className="text-xs text-hano-muted">{order.timeAgo}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function BusinessQuickActions() {
  return (
    <Card>
      <CardTitle>Quick Actions</CardTitle>
      <div className="mt-3 space-y-2">
        <div className="rounded-xl border border-hano-border p-3">
          <p className="text-xs text-hano-muted">Menu Link</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 truncate text-xs">hano.now/menu/your-place</code>
            <Button size="sm" variant="outline">
              Copy
            </Button>
          </div>
        </div>
        <Button className="w-full" variant="secondary">
          Upload Report
        </Button>
      </div>
    </Card>
  );
}
