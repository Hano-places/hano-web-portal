"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPlaceById } from "@/lib/places-data";
import { formatWeeklyHours, getOpenStatus } from "@/lib/place-hours";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const requireAuth = useRequireAuth();
  const place = getPlaceById(id);

  if (!place) {
    return <div className="py-12 text-center">Place not found</div>;
  }

  const { isOpen, todayHours } = getOpenStatus(place.hours);
  const weeklyHours = formatWeeklyHours(place.hours);
  const reviews = place.reviews ?? [];

  return (
    <div className="space-y-6">
      <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
        <Image src={place.image} alt={place.name} fill className="object-cover" priority />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            {place.featured && (
              <span className="rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-semibold text-hano-green-500">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-hano-muted">{place.category}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <Icon name="star" size={16} className="text-hano-primary-600" />
              <span className="font-medium">{place.rating.toFixed(1)}</span>
            </span>
            <span className="text-sm text-hano-muted">{place.location}</span>
            <span className="text-sm text-hano-muted">{place.priceRange}</span>
            <span className={`text-sm font-medium ${isOpen ? "text-hano-success" : "text-hano-danger-500"}`}>
              {isOpen ? "Open" : "Closed"} · {todayHours}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-hano-green-300">{place.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-hano-surface px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/places/${id}/menu`}>
            <Button variant="secondary">View Menu</Button>
          </Link>
          <Button
            onClick={() => {
              if (requireAuth("review")) {
                window.location.href = `/places/${id}/review`;
              }
            }}
          >
            Rate & Review
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Hours</h2>
          <Card>
            <ul className="space-y-2 text-sm">
              {weeklyHours.map(({ day, hours }) => (
                <li key={day} className="flex justify-between">
                  <span className="text-hano-muted">{day}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {place.menu && place.menu.length > 0 && (
          <section>
            <h2 className="mb-3 font-semibold">Menu Highlights</h2>
            <Card>
              <ul className="space-y-3">
                {place.menu[0]?.items.slice(0, 4).map((item) => (
                  <li key={item.name} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-hano-muted">{item.price}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/places/${id}/menu`} className="mt-3 inline-block text-sm text-hano-muted hover:underline">
                View full menu
              </Link>
            </Card>
          </section>
        )}
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Reviews</h2>
        <div className="space-y-3">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <Card key={`${review.author}-${i}`}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Icon
                        key={j}
                        name="star"
                        size={14}
                        className={j < review.rating ? "text-hano-primary-600" : "text-hano-border"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-hano-muted">{review.author}</span>
                </div>
                <p className="mt-2 text-sm">{review.text}</p>
              </Card>
            ))
          ) : (
            <p className="text-sm text-hano-muted">No reviews yet. Be the first!</p>
          )}
        </div>
      </section>
    </div>
  );
}
