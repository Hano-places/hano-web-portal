"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCartStore } from "@/store/cart";
import { Star } from "lucide-react";

export default function ItemDetailPage() {
  const params = useParams();
  const placeId = params.id as string;
  const itemId = params.itemId as string;
  const requireAuth = useRequireAuth();
  const addItem = useCartStore((s) => s.addItem);

  const item = PLACE_MENU_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return <div className="py-12 text-center">Item not found</div>;
  }

  const handleOrder = () => {
    if (!requireAuth("add_to_cart")) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      priceRaw: item.priceRaw,
      image: item.image,
      placeId,
      placeName: "Restaurant",
    });
    window.location.href = "/cart";
  };

  return (
    <div className="mx-auto max-w-lg">
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
        <Star className="h-4 w-4 fill-hano-primary-500 text-hano-primary-500" />
        <span>{item.rating}</span>
        <span className="text-sm text-hano-muted">{item.orders} orders</span>
      </div>
      <p className="mt-3 text-hano-green-300">{item.desc}</p>
      <p className="mt-4 text-xl font-bold">{item.price}</p>
      <Button className="mt-6 w-full" size="lg" onClick={handleOrder}>
        Place Order
      </Button>
    </div>
  );
}
