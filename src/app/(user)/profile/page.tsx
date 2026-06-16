"use client";

import Image from "next/image";
import Link from "next/link";
import { MOMENTS_FEED } from "@/lib/data/feed-data";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const businessProfile = useBusinessStore((s) => s.profile);
  const requireAuth = useRequireAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hano-primary-200 text-2xl font-bold">
          {user?.name?.[0] ?? "U"}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-sm text-hano-muted">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="ml-auto cursor-pointer rounded-lg p-2 transition-colors hover:bg-hano-surface"
          aria-label="Log out"
        >
          <Icon name="logout" size={20} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-2xl font-bold">{MOMENTS_FEED.length}</p>
          <p className="text-xs text-hano-muted">Moments</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">6</p>
          <p className="text-xs text-hano-muted">Reviews</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-hano-muted">Places saved</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Icon name="building" size={32} className="text-hano-green-500" />
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
          {MOMENTS_FEED.slice(0, 6).map((m) => (
            <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={m.image} alt="" fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
