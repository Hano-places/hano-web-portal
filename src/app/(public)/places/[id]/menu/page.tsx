"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { CartItemAction, InCartBadge, useCartItemQty } from "@/components/places/cart-item-action";
import { FilterChip } from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAddToCartWithConflict } from "@/hooks/use-add-to-cart";
import { OrderTriggerButton } from "@/components/layout/order-popover";
import { WishlistDishButton } from "@/components/wishlist/wishlist-save-button";
import { useCartStore } from "@/store/cart";
import {
  MenuItemPopoverProvider,
  useMenuItemPopover,
} from "@/components/places/menu-item-popover";

export default function PlaceMenuPage() {
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState("All");
  const requireAuth = useRequireAuth();
  const { requestAdd, conflictDialog } = useAddToCartWithConflict();
  const itemCount = useCartStore((s) => s.getItemCount());
  const place = getPlaceById(id);

  const getCategoryRank = (item: (typeof PLACE_MENU_ITEMS)[0]) =>
    PLACE_MENU_ITEMS.filter((i) => i.category === item.category)
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.orders - a.orders;
      })
      .findIndex((i) => i.id === item.id) + 1;

  const categories = ["All", ...new Set(PLACE_MENU_ITEMS.map((i) => i.category))];
  const items =
    category === "All"
      ? PLACE_MENU_ITEMS
      : PLACE_MENU_ITEMS.filter((i) => i.category === category);

  const handleAdd = (item: (typeof PLACE_MENU_ITEMS)[0]) => {
    if (!requireAuth("add_to_cart") || !place) return;
    requestAdd(
      {
        id: `${id}-${item.id}`,
        name: item.name,
        price: item.price,
        priceRaw: item.priceRaw,
        image: item.image,
        placeId: id,
        placeName: place.name,
      },
      place.image,
    );
  };

  return (
    <div className="pb-24">
      {conflictDialog}
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
        {itemCount > 0 ? <OrderTriggerButton itemCount={itemCount} /> : null}
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

      <MenuItemPopoverProvider placeId={id} placeName={place?.name ?? "Place"} onAddToCart={handleAdd}>
        <MenuItemsList
          placeId={id}
          placeName={place?.name ?? "Place"}
          items={items}
          onAdd={handleAdd}
          getCategoryRank={getCategoryRank}
        />
      </MenuItemPopoverProvider>
    </div>
  );
}

function MenuItemsList({
  placeId,
  placeName,
  items,
  onAdd,
  getCategoryRank,
}: {
  placeId: string;
  placeName: string;
  items: typeof PLACE_MENU_ITEMS;
  onAdd: (item: (typeof PLACE_MENU_ITEMS)[0]) => void;
  getCategoryRank: (item: (typeof PLACE_MENU_ITEMS)[0]) => number;
}) {
  const { openMenuItem } = useMenuItemPopover();

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          placeId={placeId}
          placeName={placeName}
          item={item}
          onAdd={onAdd}
          getCategoryRank={getCategoryRank}
          onOpen={openMenuItem}
        />
      ))}
    </div>
  );
}

function MenuItemCard({
  placeId,
  placeName,
  item,
  onAdd,
  getCategoryRank,
  onOpen,
}: {
  placeId: string;
  placeName: string;
  item: (typeof PLACE_MENU_ITEMS)[0];
  onAdd: (item: (typeof PLACE_MENU_ITEMS)[0]) => void;
  getCategoryRank: (item: (typeof PLACE_MENU_ITEMS)[0]) => number;
  onOpen: ReturnType<typeof useMenuItemPopover>["openMenuItem"];
}) {
  const cartItemId = `${placeId}-${item.id}`;
  const qty = useCartItemQty(cartItemId);
  const inCart = qty > 0;

  return (
    <article
      className={`group flex cursor-pointer gap-4 rounded-[var(--radius-card)] border bg-white p-4 transition-colors hover:border-hano-primary-400 hover:bg-hano-primary-50/40 ${
        inCart ? "border-hano-primary-500 bg-hano-primary-50/50" : "border-hano-border"
      }`}
      onClick={(event) =>
        onOpen(
          { item, categoryRank: getCategoryRank(item) },
          event.currentTarget.getBoundingClientRect(),
        )
      }
    >
      <div className="relative shrink-0">
        <div className="relative h-24 w-24">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-2xl object-cover transition-transform group-hover:scale-[1.02]"
          />
          <WishlistDishButton
            placeId={placeId}
            placeName={placeName}
            itemId={item.id}
            itemName={item.name}
            itemImage={item.image}
            itemPrice={item.price}
            itemPriceRaw={item.priceRaw}
            overlay
          />
          {inCart ? (
            <InCartBadge className="absolute -left-1.5 -top-1.5" />
          ) : null}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-hano-muted">
          <Icon name="star" size={12} className="shrink-0 text-hano-primary-600" />
          {item.rating} · {item.orders} orders
        </p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-semibold text-hano-green-400">{item.name}</p>
        <p className="mt-1 line-clamp-2 text-sm text-hano-muted">{item.desc}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Price className="font-bold text-hano-green-500">{item.price}</Price>
          <CartItemAction
            cartItemId={cartItemId}
            size="sm"
            compact
            onAdd={() => onAdd(item)}
          />
        </div>
      </div>
    </article>
  );
}
