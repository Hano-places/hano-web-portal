"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { WebPlaceCard } from "@/lib/places-data";

export function PlaceCard({ place }: { place: WebPlaceCard }) {
  return (
    <Link href={`/places/${place.id}`}>
      <Card className="overflow-hidden p-0 transition hover:shadow-md">
        <div className="relative h-40">
          <Image src={place.image} alt={place.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          {place.verified && (
            <span className="absolute left-3 top-3 rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-semibold text-hano-green-500">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-hano-green-500">{place.name}</h3>
            <span className="flex shrink-0 items-center gap-0.5 text-sm">
              <Icon name="star" size={14} className="text-hano-primary-600" />
              {place.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-hano-muted">{place.location}</p>
          <p className="mt-2 line-clamp-2 text-sm text-hano-muted">{place.description}</p>
        </div>
      </Card>
    </Link>
  );
}
