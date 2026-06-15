"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { placesApi } from "@/lib/api/places";
import { PlaceCard } from "@/components/places/place-card";
import { HOT_PROMOS, ONBOARDING_SLIDES, TOP_DISHES } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PublicHomePage() {
  const [tab, setTab] = useState<"dishes" | "places" | "moments">("places");
  const { data, isLoading } = useQuery({
    queryKey: ["places", "featured"],
    queryFn: () => placesApi.getPlaces({ limit: 8, sort: "rating", order: "desc" }),
  });

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
          <Link href="/explore">
            <Button>Explore places</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Why Hano?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ONBOARDING_SLIDES.map((slide) => (
            <div key={slide.title} className="rounded-xl border border-hano-border p-4">
              <h3 className="font-medium">{slide.title}</h3>
              <p className="mt-1 text-sm text-hano-muted">{slide.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex gap-2">
          {(["dishes", "places", "moments"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize ${
                tab === t
                  ? "bg-hano-green-500 text-white"
                  : "bg-hano-surface text-hano-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "places" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && <p className="text-sm text-hano-muted">Loading places...</p>}
            {data?.data.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        {tab === "dishes" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOP_DISHES.map((dish) => (
              <div key={dish.id} className="overflow-hidden rounded-xl border border-hano-border">
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
          <div className="text-center">
            <p className="text-hano-muted">Browse the moments feed</p>
            <Link href="/moments" className="mt-3 inline-block text-sm font-medium underline">
              View all moments
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Hot Picks & Promos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {HOT_PROMOS.map((promo) => (
            <div key={promo.id} className="flex gap-4 rounded-xl border border-hano-border p-4">
              <Image src={promo.image} alt="" width={80} height={80} className="rounded-lg object-cover" />
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
