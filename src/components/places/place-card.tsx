"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RecentOrder } from "@/lib/business/mock-data";

export function RecentOrdersPanel({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>Today&apos;s Orders</CardTitle>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span>48/80 Daily Goal</span>
            <span className="font-medium">60%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-hano-surface">
            <div className="h-full w-[60%] rounded-full bg-hano-primary-500" />
          </div>
        </div>
      </Card>

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
    </div>
  );
}

export function PlaceCard({
  place,
}: {
  place: {
    id: string;
    name: string;
    description?: string;
    bannerUrl?: string;
    logoUrl?: string;
    verified?: boolean;
  };
}) {
  const image = place.bannerUrl || place.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

  return (
    <Link href={`/places/${place.id}`}>
      <Card className="overflow-hidden p-0 transition hover:shadow-md">
        <div className="relative h-40">
          <Image src={image} alt={place.name} fill className="object-cover" />
          {place.verified && (
            <span className="absolute left-3 top-3 rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-semibold">
              Verified
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-hano-green-500">{place.name}</h3>
          {place.description && (
            <p className="mt-1 line-clamp-2 text-sm text-hano-muted">
              {place.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
