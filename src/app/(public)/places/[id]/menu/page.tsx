"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/filter-chip";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCartStore } from "@/store/cart";

export default function PlaceMenuPage() {
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState("All");
  const requireAuth = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);
  const place = getPlaceById(id);

  const categories = ["All", ...new Set(PLACE_MENU_ITEMS.map((i) => i.category))];
  const items =
    category === "All"
      ? PLACE_MENU_ITEMS
      : PLACE_MENU_ITEMS.filter((i) => i.category === category);

  const handleAdd = (item: (typeof PLACE_MENU_ITEMS)[0]) => {
    if (!requireAuth("add_to_cart")) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      priceRaw: item.priceRaw,
      image: item.image,
      placeId: id,
      placeName: place?.name ?? "Restaurant",
    });
  };

  return (
    <div>
      <Link href={`/places/${id}`} className="text-sm text-hano-muted hover:underline">
        ← Back to {place?.name ?? "Place"}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Menu</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-hano-border bg-white p-4"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link href={`/places/${id}/menu/${item.id}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-hano-muted">{item.desc}</p>
              <p className="mt-1 font-semibold">{item.price}</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => handleAdd(item)}>
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
