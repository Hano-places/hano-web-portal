"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { placesApi } from "@/lib/api/places";
import { reviewsApi } from "@/lib/api/reviews";
import { photosApi } from "@/lib/api/photos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Star } from "lucide-react";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const requireAuth = useRequireAuth();

  const { data: place, isLoading } = useQuery({
    queryKey: ["place", id],
    queryFn: () => placesApi.getPlace(id),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsApi.getReviews(id),
    enabled: !!id,
  });

  const { data: photos } = useQuery({
    queryKey: ["photos", id],
    queryFn: () => photosApi.getPlacePhotos(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="py-12 text-center text-hano-muted">Loading...</div>;
  }

  if (!place) {
    return <div className="py-12 text-center">Place not found</div>;
  }

  const banner = place.bannerUrl || place.logoUrl;

  return (
    <div className="space-y-6">
      <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
        {banner && <Image src={banner} alt={place.name} fill className="object-cover" />}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            {place.verified && (
              <span className="rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-semibold">
                Verified
              </span>
            )}
          </div>
          {place.category && (
            <p className="text-sm text-hano-muted">{place.category.name}</p>
          )}
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-hano-primary-500 text-hano-primary-500" />
            <span className="font-medium">{place.reviewStats.averageRating.toFixed(1)}</span>
            <span className="text-sm text-hano-muted">
              ({place.reviewStats.totalReviews} reviews)
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-hano-green-300">{place.description}</p>
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

      {photos && photos.photos.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">Photos</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.photos.map((photo) => (
              <Image
                key={photo.id}
                src={photo.url}
                alt=""
                width={120}
                height={120}
                className="rounded-xl object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Reviews</h2>
        <div className="space-y-3">
          {reviews?.data.map((review) => (
            <Card key={review.id}>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-hano-primary-500 text-hano-primary-500" : "text-hano-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-hano-muted">
                  {review.user?.name ?? "Anonymous"}
                </span>
              </div>
              {review.comment && <p className="mt-2 text-sm">{review.comment}</p>}
            </Card>
          ))}
          {reviews?.data.length === 0 && (
            <p className="text-sm text-hano-muted">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
