"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useBusinessStore } from "@/store/business";
import { businessApi } from "@/lib/business/api-adapter";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceSocialLinks } from "@/components/places/place-social-links";
import { PlaceWeeklyHours } from "@/components/places/place-weekly-hours";
import { businessHoursToWeeklyHours } from "@/lib/business-hours";
import { formatRwf } from "@/lib/utils";
import type { OperationOrder } from "@/lib/business/mock-data";

export default function BusinessProfilePage() {
  const profile = useBusinessStore((s) => s.profile);
  const updateProfile = useBusinessStore((s) => s.updateProfile);
  const [orders, setOrders] = useState<OperationOrder[]>([]);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    businessApi.getOperations().then(setOrders);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setWebsite(profile.website || "");
    setInstagram(profile.sameAs.find((url) => url.includes("instagram")) ?? "");
    setFacebook(profile.sameAs.find((url) => url.includes("facebook")) ?? "");
  }, [profile]);

  if (!profile) return null;

  const weeklyHours = businessHoursToWeeklyHours(profile.hours);
  const socialLinks = [instagram, facebook, website].filter(Boolean);

  const saveSocialLinks = (event: FormEvent) => {
    event.preventDefault();
    const sameAs = [instagram, facebook].map((url) => url.trim()).filter(Boolean);
    updateProfile({
      website: website.trim(),
      sameAs,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Business Profile</h1>
          <p className="text-sm text-hano-muted">
            What customers see on your place page — profile, hours, and social links
          </p>
        </div>
        <Link
          href={`/places/${profile.placeSlug}`}
          className="text-sm font-medium text-hano-green-500 hover:underline"
        >
          View public page →
        </Link>
      </div>

      <Card className="space-y-3">
        <CardTitle>{profile.name}</CardTitle>
        <p className="text-sm">
          <strong>Category:</strong> {profile.category}
        </p>
        <p className="text-sm">
          <strong>Address:</strong> {profile.address}
        </p>
        <p className="text-sm">
          <strong>Phone:</strong> {profile.phone}
        </p>
        <p className="text-sm text-hano-muted">{profile.description}</p>
        <p className="text-sm text-hano-muted">
          {profile.menuItems.length} menu items · {profile.promos.length} promotions
        </p>
        <p className="text-xs text-hano-muted">
          Public URL slug: <strong>{profile.placeSlug}</strong>
        </p>
      </Card>

      <section>
        <h2 className="mb-3 font-semibold text-hano-green-500">Hours preview</h2>
        <PlaceWeeklyHours hours={weeklyHours} />
      </section>

      <Card>
        <CardTitle>Social links</CardTitle>
        <form onSubmit={saveSocialLinks} className="mt-4 space-y-3">
          <Input
            placeholder="Website URL"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
          <Input
            placeholder="Instagram URL"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
          />
          <Input
            placeholder="Facebook URL"
            value={facebook}
            onChange={(event) => setFacebook(event.target.value)}
          />
          <Button type="submit" size="sm" variant="secondary">
            Save links
          </Button>
        </form>
        {socialLinks.length > 0 ? (
          <div className="mt-4">
            <PlaceSocialLinks links={socialLinks} />
          </div>
        ) : null}
      </Card>

      <Card>
        <CardTitle>Menu preview</CardTitle>
        {profile.menuItems.length === 0 ? (
          <p className="mt-2 text-sm text-hano-muted">No menu items yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {profile.menuItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-hano-border px-3 py-2 text-sm"
              >
                <span className="font-medium text-hano-green-500">{item.name}</span>
                <span className="text-hano-muted">{formatRwf(item.priceRaw)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardTitle>Recent operations</CardTitle>
        <p className="mt-2 text-sm text-hano-muted">
          {orders.length} orders in queue (live data from operations)
        </p>
      </Card>
    </div>
  );
}
