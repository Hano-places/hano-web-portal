"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useBusinessStore, type BusinessPromo } from "@/store/business";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PromoType } from "@/lib/data/mock-data";

const PROMO_TYPES: PromoType[] = ["Discount", "Free Item", "Add-on"];
const PROMO_STATUSES: BusinessPromo["status"][] = ["Active", "Upcoming", "Ended"];

export default function BusinessMarketingPage() {
  const profile = useBusinessStore((s) => s.profile);
  const addPromo = useBusinessStore((s) => s.addPromo);
  const removePromo = useBusinessStore((s) => s.removePromo);
  const updatePromoStatus = useBusinessStore((s) => s.updatePromoStatus);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promoType, setPromoType] = useState<PromoType>("Discount");
  const [status, setStatus] = useState<BusinessPromo["status"]>("Active");
  const [image, setImage] = useState("");
  const [includedItemIds, setIncludedItemIds] = useState<string[]>([]);

  if (!profile) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    addPromo({
      title: title.trim(),
      description: description.trim() || `Promotion at ${profile.name}`,
      promoType,
      status,
      image: image.trim() || profile.bannerUrl || profile.logoUrl,
      includedItemIds,
    });

    setTitle("");
    setDescription("");
    setImage("");
    setIncludedItemIds([]);
    setPromoType("Discount");
    setStatus("Active");
  };

  const toggleMenuItem = (itemId: string) => {
    setIncludedItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketing</h1>
        <p className="text-sm text-hano-muted">
          Promotions shown on your public place page — same format customers see at{" "}
          <Link href={`/places/${profile.placeSlug}`} className="text-hano-green-500 hover:underline">
            /places/{profile.placeSlug}
          </Link>
        </p>
      </div>

      <Card>
        <CardTitle>Create promotion</CardTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            placeholder="Promo title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="h-20 w-full rounded-xl border border-hano-border p-3 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-hano-muted">Type</span>
              <select
                value={promoType}
                onChange={(event) => setPromoType(event.target.value as PromoType)}
                className="w-full rounded-xl border border-hano-border px-3 py-2 text-sm"
              >
                {PROMO_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-hano-muted">Status</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as BusinessPromo["status"])
                }
                className="w-full rounded-xl border border-hano-border px-3 py-2 text-sm"
              >
                {PROMO_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Input
            placeholder="Cover image URL (optional)"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
          {profile.menuItems.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium text-hano-green-500">
                Included menu items
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.menuItems.map((item) => {
                  const selected = includedItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleMenuItem(item.id)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        selected
                          ? "border-hano-primary-500 bg-hano-primary-100 text-hano-green-500"
                          : "border-hano-border text-hano-muted hover:border-hano-primary-400"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-hano-muted">
              Add menu items under Operations to attach dishes to promos.
            </p>
          )}
          <Button type="submit" variant="secondary">
            Publish promotion
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Active promotions</CardTitle>
        {profile.promos.length === 0 ? (
          <p className="mt-2 text-sm text-hano-muted">No promotions yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {profile.promos.map((promo) => (
              <li
                key={promo.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-hano-border p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-hano-green-500">{promo.title}</p>
                  <p className="mt-1 text-sm text-hano-muted">{promo.description}</p>
                  <p className="mt-2 text-xs text-hano-muted">
                    {promo.promoType} · {promo.includedItemIds.length} item
                    {promo.includedItemIds.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={promo.status}
                    onChange={(event) =>
                      updatePromoStatus(
                        promo.id,
                        event.target.value as BusinessPromo["status"],
                      )
                    }
                    className="rounded-lg border border-hano-border px-2 py-1 text-xs"
                  >
                    {PROMO_STATUSES.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removePromo(promo.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
