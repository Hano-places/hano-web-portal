"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { placesApi } from "@/lib/api/places";
import { photosApi } from "@/lib/api/photos";
import { PlaceCard } from "@/components/places/place-card";
import { HOT_PROMOS, TOP_DISHES } from "@/lib/data/mock-data";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [tab, setTab] = useState<"dishes" | "places" | "moments">("places");

  const { data: places } = useQuery({
    queryKey: ["places", "home"],
    queryFn: () => placesApi.getPlaces({ limit: 6, sort: "rating", order: "desc" }),
  });

  const { data: photos } = useQuery({
    queryKey: ["my-photos-home"],
    queryFn: () => photosApi.getMyPhotos(6, 0),
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-hano-muted">📍 Kigali, Nyarutarama</p>
        <Input placeholder="Search places, dishes..." className="mt-3" />
      </div>

      <div className="flex gap-2">
        {(["dishes", "places", "moments"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${
              tab === t ? "bg-hano-green-500 text-white" : "bg-hano-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "places" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Top Places</h2>
            <Link href="/explore" className="text-sm text-hano-muted hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {places?.data.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {tab === "dishes" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {TOP_DISHES.map((dish) => (
            <div key={dish.id} className="flex gap-3 rounded-xl border border-hano-border p-3">
              <Image src={dish.image} alt="" width={72} height={72} className="rounded-lg object-cover" />
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
          {photos?.photos.map((p) => (
            <Image key={p.id} src={p.url} alt="" width={120} height={120} className="rounded-xl object-cover" />
          ))}
          {(!photos?.photos || photos.photos.length === 0) && (
            <p className="col-span-3 text-sm text-hano-muted">No moments yet. Capture one!</p>
          )}
        </div>
      )}

      <section>
        <h2 className="mb-4 font-semibold">Hot Picks & Promos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOT_PROMOS.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-xl border p-3">
              <Image src={p.image} alt="" width={64} height={64} className="rounded-lg object-cover" />
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
