"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getPlaceSeeds,
  getPlaceSeedsByType,
  searchPlaceSeeds,
} from "@/lib/places-data";
import { PlaceCard } from "@/components/places/place-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";
import { LOCATION_CATEGORIES } from "@/lib/data/mock-data";

export default function PlacesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const places = useMemo(() => {
    if (query.trim()) {
      const results = searchPlaceSeeds(query);
      if (category === "All") return results;
      const typed = getPlaceSeedsByType(category.toLowerCase());
      return results.filter((r) => typed.some((t) => t.id === r.id));
    }
    return category === "All" ? getPlaceSeeds() : getPlaceSeedsByType(category.toLowerCase());
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hano-green-500">Places</h1>
          <p className="text-sm text-hano-muted">
            {places.length} spots across Kigali — browse, view menus, and order ahead
          </p>
        </div>
        <Link href="/cart">
          <Button variant="outline" size="sm" className="gap-2">
            <Icon name="cart" size={16} />
            View cart
          </Button>
        </Link>
      </div>

      <SearchInput
        fieldSize="md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, area, or cuisine..."
        wrapperClassName="max-w-xl"
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

      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hano-border bg-white py-16 text-center">
          <p className="text-hano-muted">No places match your search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-3 cursor-pointer text-sm font-medium text-hano-green-500 underline-offset-2 transition-colors hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
