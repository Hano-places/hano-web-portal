"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { searchApi } from "@/lib/api/search";
import { PlaceCard } from "@/components/places/place-card";
import { Input } from "@/components/ui/input";
import { LOCATION_CATEGORIES } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";

export default function LocationPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["location-search", query, category],
    queryFn: () =>
      searchApi.search({
        q: query || undefined,
        category: category === "All" ? undefined : category.toLowerCase(),
        limit: 12,
      }),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-hano-green-500 p-6 text-white">
        <h1 className="text-xl font-bold">Your Location</h1>
        <p className="mt-1 text-sm opacity-80">Kigali, Rwanda</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() =>
            window.open("https://www.google.com/maps/search/?api=1&query=Kigali,Rwanda", "_blank")
          }
        >
          Open in Google Maps
        </Button>
      </div>

      <Input placeholder="Search nearby places..." value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {LOCATION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${
              category === cat ? "bg-hano-primary-500 text-hano-green-500" : "bg-hano-surface"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading && <p className="text-sm text-hano-muted">Loading...</p>}
        {data?.places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}
