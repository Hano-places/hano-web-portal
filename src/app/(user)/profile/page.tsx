"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { photosApi } from "@/lib/api/photos";
import { reviewsApi } from "@/lib/api/reviews";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const businessProfile = useBusinessStore((s) => s.profile);
  const requireAuth = useRequireAuth();

  const { data: photos } = useQuery({
    queryKey: ["my-photos-profile"],
    queryFn: () => photosApi.getMyPhotos(12, 0),
  });

  const { data: reviews } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => reviewsApi.getMyReviews(10, 0),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hano-primary-200 text-2xl font-bold">
          {user?.name?.[0] ?? "U"}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-sm text-hano-muted">{user?.email}</p>
        </div>
        <button type="button" onClick={() => logout()} className="ml-auto rounded-lg p-2 hover:bg-hano-surface">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-xl font-bold">{photos?.total ?? 0}</p>
          <p className="text-xs text-hano-muted">Moments</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{reviews?.total ?? 0}</p>
          <p className="text-xs text-hano-muted">Reviews</p>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-hano-green-500" />
          <div className="flex-1">
            <p className="font-medium">Business account</p>
            <p className="text-sm text-hano-muted">
              {businessProfile
                ? `Managing ${businessProfile.name}`
                : "Create a business to manage your restaurant"}
            </p>
          </div>
          {businessProfile ? (
            <Link href="/business/overview">
              <Button size="sm" variant="secondary">
                Business Portal
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (requireAuth("create_business")) {
                  window.location.href = "/business/create";
                }
              }}
            >
              Create business
            </Button>
          )}
        </div>
      </Card>

      <section>
        <h2 className="mb-3 font-semibold">My Moments</h2>
        <div className="grid grid-cols-3 gap-2">
          {photos?.photos.map((p) => (
            <Image key={p.id} src={p.url} alt="" width={120} height={120} className="rounded-xl object-cover" />
          ))}
        </div>
      </section>
    </div>
  );
}
