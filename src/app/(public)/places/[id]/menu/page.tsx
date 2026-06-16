"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { AddToCartButton } from "@/components/places/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCartStore } from "@/store/cart";

export default function PlaceMenuPage() {
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState("All");
  const requireAuth = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());
  const place = getPlaceById(id);

  const categories = ["All", ...new Set(PLACE_MENU_ITEMS.map((i) => i.category))];
  const items =
    category === "All"
      ? PLACE_MENU_ITEMS
      : PLACE_MENU_ITEMS.filter((i) => i.category === category);

  const handleAdd = (item: (typeof PLACE_MENU_ITEMS)[0]) => {
    if (!requireAuth("add_to_cart")) return;
    addItem({
      id: `${id}-${item.id}`,
      name: item.name,
      price: item.price,
      priceRaw: item.priceRaw,
      image: item.image,
      placeId: id,
      placeName: place?.name ?? "Restaurant",
    });
  };

  return (
    <div className="pb-24">
      <Link
        href={`/places/${id}`}
        className="inline-flex cursor-pointer items-center gap-1 text-sm text-hano-muted transition-colors hover:text-hano-green-500"
      >
        <Icon name="chevronLeft" size={16} />
        Back to {place?.name ?? "Place"}
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-hano-green-500">Menu</h1>
          <p className="text-sm text-hano-muted">
            {place?.name} · {items.length} items available
          </p>
        </div>
        {itemCount > 0 ? (
          <Link href="/cart">
            <Button variant="secondary" size="sm" className="gap-2">
              <Icon name="cart" size={16} />
              Cart ({itemCount})
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="group flex cursor-pointer gap-4 rounded-[var(--radius-card)] border border-hano-border bg-white p-4 transition-colors hover:border-hano-primary-400 hover:bg-hano-primary-50/40"
          >
            <Link href={`/places/${id}/menu/${item.id}`} className="shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-2xl object-cover transition-transform group-hover:scale-[1.02]"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/places/${id}/menu/${item.id}`}
                className="font-semibold text-hano-green-500 transition-colors hover:text-hano-green-400"
              >
                {item.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-hano-muted">{item.desc}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                <div>
                  <p className="font-bold text-hano-green-500">{item.price}</p>
                  <p className="flex items-center gap-1 text-xs text-hano-muted">
                    <Icon name="star" size={12} className="text-hano-primary-600" />
                    {item.rating} · {item.orders} orders
                  </p>
                </div>
                <AddToCartButton size="sm" onClick={() => handleAdd(item)} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {itemCount > 0 ? (
        <div className="fixed bottom-4 left-1/2 z-30 flex w-[min(100%,28rem)] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-hano-border bg-white px-5 py-3 shadow-lg md:left-[calc(50%+7rem)]">
          <span className="text-sm font-medium text-hano-green-500">
            {itemCount} in cart
          </span>
          <div className="flex gap-2">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                View cart
              </Button>
            </Link>
            <Link href="/checkout/preview">
              <Button size="sm">Checkout</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
