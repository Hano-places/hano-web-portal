"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getFeaturedPlaceSeeds } from "@/lib/places-data";
import { PlaceCard } from "@/components/places/place-card";
import { HOT_PROMOS, TOP_DISHES } from "@/lib/data/mock-data";
import { HOME_KPIS, MOMENTS_FEED } from "@/lib/data/feed-data";
import { PeriodPill } from "@/components/ui/period-pill";
import { Card } from "@/components/ui/card";
import { FilterChip } from "@/components/ui/filter-chip";

const PERIODS = ["Today", "7d", "30d", "1M"];

export default function HomePage() {
  const [period, setPeriod] = useState("Today");
  const [tab, setTab] = useState<"dishes" | "places" | "moments">("places");
  const featured = getFeaturedPlaceSeeds();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-hano-muted">📍 Kigali, Nyarutarama</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-hano-muted">
          Featured places, top dishes, and moments from around Kigali
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <PeriodPill key={p} label={p} active={period === p} onClick={() => setPeriod(p)} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {HOME_KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-sm text-hano-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
            {kpi.change && <p className="mt-1 text-xs text-hano-muted">{kpi.change}</p>}
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["dishes", "places", "moments"] as const).map((t) => (
          <FilterChip key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
        ))}
      </div>

      {tab === "places" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Featured Places</h2>
            <Link href="/places" className="text-sm text-hano-muted hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {tab === "dishes" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {TOP_DISHES.map((dish) => (
            <div key={dish.id} className="flex gap-3 rounded-xl border border-hano-border bg-white p-3">
              <Image
                src={dish.image}
                alt=""
                width={72}
                height={72}
                className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{dish.name}</p>
                <p className="text-xs text-hano-muted">{dish.location}</p>
                <p className="text-sm font-semibold">{dish.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "moments" && (
        <div className="grid grid-cols-3 gap-2">
          {MOMENTS_FEED.slice(0, 6).map((m) => (
            <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={m.image} alt="" fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-4 font-semibold">Hot Picks & Promos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOT_PROMOS.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-xl border border-hano-border bg-white p-3">
              <Image
                src={p.image}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-hano-muted">{p.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
