"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchApi } from "@/lib/api/search";
import { PlaceCard } from "@/components/places/place-card";
import { Input } from "@/components/ui/input";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "verified">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["search", query, filter],
    queryFn: () =>
      searchApi.search({
        q: query || undefined,
        limit: 20,
      }),
  });

  const places = data?.places.filter((p) => (filter === "verified" ? p.verified : true)) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Explore Places</h1>
      <p className="mt-1 text-sm text-hano-muted">
        Search and discover restaurants, cafés, and lounges in Kigali
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {(["all", "verified"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm capitalize ${
                filter === f
                  ? "bg-hano-primary-500 text-hano-green-500"
                  : "border border-hano-border"
              }`}
            >
              {f === "all" ? "All" : "Verified"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-sm text-hano-muted">Searching...</p>}
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
        {!isLoading && places.length === 0 && (
          <p className="text-sm text-hano-muted">No places found.</p>
        )}
      </div>
    </div>
  );
}
