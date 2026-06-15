"use client";

import Image from "next/image";
import Link from "next/link";
import { MOMENTS_FEED } from "@/lib/data/feed-data";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";

export default function MomentsPage() {
  const requireAuth = useRequireAuth();

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

      <div className="mt-6 columns-2 gap-4 sm:columns-3">
        {MOMENTS_FEED.map((moment) => (
          <div key={moment.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-hano-border bg-white">
            <Image
              src={moment.image}
              alt=""
              width={300}
              height={300}
              className="h-auto w-full object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-medium">{moment.place}</p>
              <p className="text-xs text-hano-muted">
                {moment.author} · {moment.likes} likes
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-hano-muted">
          Sign in to share your own moments at your favorite places.
        </p>
        <Link href="/places" className="mt-3 inline-block text-sm font-medium underline">
          Explore places
        </Link>
      </div>
    </div>
  );
}
