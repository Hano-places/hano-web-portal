"use client";

import { useEffect, useMemo, useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import type { PlaceSeed } from "@/content/places";
import { sortWishlist, useWishlistStore } from "@/store/wishlist";
import { useWishlistPopover } from "@/components/layout/wishlist-popover";
import { PlaceCard } from "@/components/places/place-card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const COLLAPSED_STORAGE_KEY = "@hano/home-saved-places-collapsed";

export function SavedPlacesHero() {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const places = useWishlistStore((s) => s.places);
  const { openWishlistPopover } = useWishlistPopover();
  const savedPlaces = useMemo(() => sortWishlist(places), [places]);

  const placeCards = useMemo(
    () =>
      savedPlaces
        .map((saved) => getPlaceById(saved.placeId))
        .filter((place): place is PlaceSeed => Boolean(place)),
    [savedPlaces],
  );

  useEffect(() => {
    setHydrated(true);
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true");
    } catch {
      setCollapsed(false);
    }
  }, []);

  const setCollapsedPreference = (value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(value));
    } catch {
      // ignore storage errors
    }
  };

  if (!hydrated || savedPlaces.length === 0) {
    return null;
  }

  if (collapsed) {
    return (
      <section className="rounded-(--radius-card) border border-hano-border bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-hano-muted">
            <Icon name="heart" size={16} className="text-[#c43d5c]" />
            <span>
              {savedPlaces.length} saved place{savedPlaces.length === 1 ? "" : "s"}
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCollapsedPreference(false)}>
            Show saved places
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="heart" size={18} className="text-[#c43d5c]" />
            <h2 className="text-lg font-semibold text-hano-green-500">Saved places</h2>
          </div>
          <p className="mt-1 text-sm text-hano-muted">
            Your favorites, ready to order again
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(event) =>
              openWishlistPopover(event.currentTarget.getBoundingClientRect())
            }
          >
            View all
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setCollapsedPreference(true)}>
            Hide
          </Button>
        </div>
      </div>

      {placeCards.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {placeCards.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-hano-muted">
          Saved places could not be loaded. Open Saved to review your list.
        </p>
      )}
    </section>
  );
}
