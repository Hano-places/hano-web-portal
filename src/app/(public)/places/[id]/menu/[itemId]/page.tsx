"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPlaceById } from "@/lib/places-data";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { AddToCartButton } from "@/components/places/add-to-cart-button";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAddToCartWithConflict } from "@/hooks/use-add-to-cart";
import { useOrderPopover } from "@/components/layout/order-popover";
import { Icon } from "@/components/ui/icon";

export default function ItemDetailPage() {
  const params = useParams();
  const placeId = params.id as string;
  const itemId = params.itemId as string;
  const requireAuth = useRequireAuth();
  const { requestAdd, conflictDialog } = useAddToCartWithConflict();
  const { openOrderPopover } = useOrderPopover();
  const place = getPlaceById(placeId);

  const item = PLACE_MENU_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return <div className="py-12 text-center">Item not found</div>;
  }

  const handleOrder = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!requireAuth("add_to_cart") || !place) return;
    const added = requestAdd(
      {
        id: `${placeId}-${item.id}`,
        name: item.name,
        price: item.price,
        priceRaw: item.priceRaw,
        image: item.image,
        placeId,
        placeName: place.name,
      },
      place.image,
    );
    if (added) {
      openOrderPopover(event.currentTarget.getBoundingClientRect());
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      {conflictDialog}
      <Link
        href={`/places/${placeId}/menu`}
        className="text-sm text-hano-muted hover:underline"
      >
        ← Back to menu
      </Link>
      <div className="relative mt-4 h-56 overflow-hidden rounded-2xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">{item.name}</h1>
      <div className="mt-2 flex items-center gap-2">
        <Icon name="star" size={16} className="text-hano-primary-500" />
        <span>{item.rating}</span>
        <span className="text-sm text-hano-muted">{item.orders} orders</span>
      </div>
      <p className="mt-3 text-hano-green-300">{item.desc}</p>
      <p className="mt-4 text-xl font-bold">{item.price}</p>
      <AddToCartButton className="mt-6 w-full" onClick={handleOrder} />
    </div>
  );
}
