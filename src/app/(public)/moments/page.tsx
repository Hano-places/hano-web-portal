"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { photosApi } from "@/lib/api/photos";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";

export default function MomentsPage() {
  const requireAuth = useRequireAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-photos-public"],
    queryFn: () => photosApi.getMyPhotos(20, 0),
    retry: false,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moments</h1>
          <p className="text-sm text-hano-muted">
            Discover photos shared at Kigali&apos;s best spots
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (requireAuth("upload_moment")) {
              window.location.href = "/moments/capture";
            }
          }}
        >
          Share a moment
        </Button>
      </div>

      {isLoading && <p className="mt-8 text-hano-muted">Loading moments...</p>}

      <div className="mt-6 columns-2 gap-4 sm:columns-3">
        {data?.photos.map((photo) => (
          <Link key={photo.id} href={`/moments/${photo.id}`} className="mb-4 block break-inside-avoid">
            <Image
              src={photo.url}
              alt=""
              width={300}
              height={300}
              className="w-full rounded-xl object-cover"
            />
          </Link>
        ))}
      </div>

      {!isLoading && (!data?.photos || data.photos.length === 0) && (
        <div className="mt-12 text-center">
          <p className="text-hano-muted">
            Sign in to see your moments, or explore places to discover shared photos.
          </p>
          <Link href="/explore" className="mt-3 inline-block text-sm font-medium underline">
            Explore places
          </Link>
        </div>
      )}
    </div>
  );
}
