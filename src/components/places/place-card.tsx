"use client";

import type { PlaceSeed } from "@/content/places";
import { PlaceCutoutCard } from "@/components/places/place-cutout-card";

type PlaceCardProps = {
  place: PlaceSeed;
  showOrderHint?: boolean;
};

export function PlaceCard({ place, showOrderHint = true }: PlaceCardProps) {
  return (
    <PlaceCutoutCard
      place={place}
      href={`/places/${place.id}`}
      showOrderHint={showOrderHint}
    />
  );
}
