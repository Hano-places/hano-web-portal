"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { NOTIFICATIONS, PROMOS } from "@/lib/data/feed-data";

export function NotificationsRail() {
  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-hano-border bg-white p-4 xl:block">
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-hano-green-500">Notifications</h2>
          <ul className="space-y-3">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="rounded-xl border border-hano-border p-3 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-1 text-xs text-hano-muted line-clamp-2">{n.body}</p>
                <p className="mt-2 text-xs text-hano-muted">{n.timeAgo}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-hano-green-500">Hot Promos</h2>
          <div className="space-y-3">
            {PROMOS.map((promo) => (
              <Card key={promo.id} className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                <div className="relative h-24">
                  <Image src={promo.image} alt="" fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{promo.title}</p>
                  <p className="mt-1 text-xs text-hano-muted">{promo.location}</p>
                  <p className="mt-1 text-xs font-medium text-hano-primary-700">
                    +{promo.points} pts
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <Link href="/places" className="mt-3 block text-center text-xs text-hano-muted transition-colors hover:text-hano-green-500 hover:underline">
            View all promos
          </Link>
        </section>
      </div>
    </aside>
  );
}

export function DailyGoalCard() {
  return (
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
  );
}
