"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getFeaturedPlaceSeeds } from "@/lib/places-data";
import { PlaceCard } from "@/components/places/place-card";
import { HOT_PROMOS, ONBOARDING_SLIDES, TOP_DISHES } from "@/lib/data/mock-data";
import { HOME_KPIS, MOMENTS_FEED } from "@/lib/data/feed-data";
import { Button } from "@/components/ui/button";
import { PeriodPill } from "@/components/ui/period-pill";
import { Card } from "@/components/ui/card";
import { FilterChip } from "@/components/ui/filter-chip";

const PERIODS = ["Today", "7d", "30d", "1M"];

export default function PublicHomePage() {
  const [period, setPeriod] = useState("Today");
  const [tab, setTab] = useState<"dishes" | "places" | "moments">("places");
  const featured = getFeaturedPlaceSeeds();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-hano-primary-100 p-8">
        <h1 className="text-3xl font-bold text-hano-green-500">
          Discover Kigali&apos;s best places
        </h1>
        <p className="mt-2 max-w-xl text-hano-green-300">
          Browse restaurants, cafés, and lounges. No account needed to explore — sign in when
          you&apos;re ready to order or share moments.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/places">
            <Button>Explore places</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </section>

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
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Why Hano?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ONBOARDING_SLIDES.map((slide) => (
            <div key={slide.title} className="rounded-xl border border-hano-border bg-white p-4">
              <h3 className="font-medium">{slide.title}</h3>
              <p className="mt-1 text-sm text-hano-muted">{slide.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(["dishes", "places", "moments"] as const).map((t) => (
          <FilterChip key={t} label={t} active={tab === t} onClick={() => setTab(t)} />
        ))}
      </div>

      {tab === "places" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {tab === "dishes" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_DISHES.map((dish) => (
            <div key={dish.id} className="overflow-hidden rounded-xl border border-hano-border bg-white">
              <div className="relative h-32">
                <Image src={dish.image} alt={dish.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium">{dish.name}</p>
                <p className="text-xs text-hano-muted">{dish.location}</p>
                <p className="mt-1 text-sm font-semibold text-hano-green-500">{dish.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "moments" && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {MOMENTS_FEED.slice(0, 8).map((m) => (
            <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={m.image} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Hot Picks & Promos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {HOT_PROMOS.map((promo) => (
            <div key={promo.id} className="flex gap-4 rounded-xl border border-hano-border bg-white p-4">
              <Image
                src={promo.image}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{promo.title}</p>
                <p className="text-sm text-hano-muted">{promo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
