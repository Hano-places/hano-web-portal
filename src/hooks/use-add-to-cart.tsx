"use client";

import { useCallback, useState } from "react";
import type { CartItem, PlaceMeta } from "@/store/cart";
import { useCartStore } from "@/store/cart";
import { PlaceConflictDialog } from "@/components/places/place-conflict-dialog";

type PendingAdd = {
  item: Omit<CartItem, "qty">;
  placeImage: string;
  nextPlace: PlaceMeta;
};

export function useAddToCartWithConflict() {
  const getPlaceConflict = useCartStore((s) => s.getPlaceConflict);
  const addItem = useCartStore((s) => s.addItem);
  const addItemWithStrategy = useCartStore((s) => s.addItemWithStrategy);
  const [pending, setPending] = useState<PendingAdd | null>(null);
  const [currentPlace, setCurrentPlace] = useState<PlaceMeta | null>(null);

  const requestAdd = useCallback(
    (item: Omit<CartItem, "qty">, placeImage: string) => {
      const conflict = getPlaceConflict(item.placeId);
      if (conflict) {
        setCurrentPlace(conflict);
        setPending({
          item,
          placeImage,
          nextPlace: {
            placeId: item.placeId,
            placeName: item.placeName,
            placeImage,
          },
        });
        return false;
      }

      addItem(item, placeImage);
      return true;
    },
    [addItem, getPlaceConflict],
  );

  const resolvePending = useCallback(
    (strategy: "replace" | "save-draft") => {
      if (!pending) return;
      addItemWithStrategy(pending.item, pending.placeImage, strategy);
      setPending(null);
      setCurrentPlace(null);
    },
    [addItemWithStrategy, pending],
  );

  const cancelPending = useCallback(() => {
    setPending(null);
    setCurrentPlace(null);
  }, []);

  const conflictDialog =
    pending && currentPlace ? (
      <PlaceConflictDialog
        open
        currentPlace={currentPlace}
        nextPlace={pending.nextPlace}
        onSaveDraft={() => resolvePending("save-draft")}
        onReplace={() => resolvePending("replace")}
        onCancel={cancelPending}
      />
    ) : null;

  return { requestAdd, conflictDialog };
}
