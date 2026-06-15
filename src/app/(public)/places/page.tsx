"use client";

import { useMemo, useState } from "react";
import { getPlaces, getPlacesByType, searchPlaces } from "@/lib/places-data";
import { PlaceCard } from "@/components/places/place-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { LOCATION_CATEGORIES } from "@/lib/data/mock-data";

export default function PlacesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const places = useMemo(() => {
    if (query.trim()) {
      const results = searchPlaces(query);
      if (category === "All") return results;
      const typed = getPlacesByType(category.toLowerCase());
      return results.filter((r) => typed.some((t) => t.id === r.id));
    }
    return category === "All" ? getPlaces() : getPlacesByType(category.toLowerCase());
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Places</h1>
        <p className="text-sm text-hano-muted">
          Discover restaurants, cafés, lounges, and bars across Kigali
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search places..."
        className="h-10 w-full max-w-lg rounded-full border border-hano-border bg-white px-4 text-sm outline-none focus:border-hano-green-500"
      />

      <div className="flex flex-wrap gap-2">
        {LOCATION_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}
