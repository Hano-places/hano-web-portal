"use client";

import type { MouseEvent } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { usePersistHydrated } from "@/hooks/use-persist-hydrated";
import { useWishlistStore } from "@/store/wishlist";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import styles from "./wishlist-save-button.module.css";

type WishlistPlaceButtonProps = {
  placeId: string;
  placeName: string;
  placeImage: string;
  category?: string;
  rating?: number;
  className?: string;
  overlay?: boolean;
  size?: "sm" | "md";
};

type WishlistDishButtonProps = {
  placeId: string;
  placeName: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  itemPrice: string;
  itemPriceRaw: number;
  className?: string;
  overlay?: boolean;
  size?: "sm" | "md";
};

export function WishlistPlaceButton({
  placeId,
  placeName,
  placeImage,
  category,
  rating,
  className,
  overlay = false,
  size = "md",
}: WishlistPlaceButtonProps) {
  const requireAuth = useRequireAuth();
  const hydrated = usePersistHydrated(useWishlistStore.persist);
  const isSavedRaw = useWishlistStore((s) => s.isPlaceSaved(placeId));
  const isSaved = hydrated && isSavedRaw;
  const togglePlace = useWishlistStore((s) => s.togglePlace);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!requireAuth("save_wishlist")) return;
    togglePlace({ placeId, placeName, placeImage, category, rating });
  };

  return (
    <button
      type="button"
      className={cn(
        styles.button,
        size === "sm" && styles.buttonSm,
        overlay && styles.buttonOverlay,
        isSaved && styles.buttonSaved,
        className,
      )}
      onClick={handleClick}
      aria-label={isSaved ? `Remove ${placeName} from saved` : `Save ${placeName}`}
      aria-pressed={isSaved}
    >
      <Icon name="heart" size={size === "sm" ? 14 : 16} />
    </button>
  );
}

export function WishlistDishButton({
  placeId,
  placeName,
  itemId,
  itemName,
  itemImage,
  itemPrice,
  itemPriceRaw,
  className,
  overlay = false,
  size = "sm",
}: WishlistDishButtonProps) {
  const requireAuth = useRequireAuth();
  const hydrated = usePersistHydrated(useWishlistStore.persist);
  const isSavedRaw = useWishlistStore((s) => s.isDishSaved(placeId, itemId));
  const isSaved = hydrated && isSavedRaw;
  const toggleDish = useWishlistStore((s) => s.toggleDish);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!requireAuth("save_wishlist")) return;
    toggleDish({
      placeId,
      placeName,
      itemId,
      name: itemName,
      image: itemImage,
      price: itemPrice,
      priceRaw: itemPriceRaw,
    });
  };

  return (
    <button
      type="button"
      className={cn(
        styles.button,
        size === "sm" && styles.buttonSm,
        overlay && styles.buttonOverlay,
        isSaved && styles.buttonSaved,
        className,
      )}
      onClick={handleClick}
      aria-label={isSaved ? `Remove ${itemName} from saved` : `Save ${itemName}`}
      aria-pressed={isSaved}
    >
      <Icon name="heart" size={size === "sm" ? 14 : 16} />
    </button>
  );
}
