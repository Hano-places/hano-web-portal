import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSafePersistStorage } from "@/lib/safe-persist-storage";

export type WishlistPlace = {
  placeId: string;
  placeName: string;
  placeImage: string;
  category?: string;
  rating?: number;
  pinned: boolean;
  savedAt: string;
};

export type WishlistDish = {
  id: string;
  itemId: string;
  placeId: string;
  placeName: string;
  name: string;
  image: string;
  price: string;
  priceRaw: number;
  pinned: boolean;
  savedAt: string;
};

type WishlistPlaceInput = Omit<WishlistPlace, "pinned" | "savedAt">;
type WishlistDishInput = Omit<WishlistDish, "id" | "pinned" | "savedAt">;

interface WishlistState {
  places: WishlistPlace[];
  dishes: WishlistDish[];
  togglePlace: (place: WishlistPlaceInput) => void;
  toggleDish: (dish: WishlistDishInput) => void;
  togglePinPlace: (placeId: string) => void;
  togglePinDish: (id: string) => void;
  removePlace: (placeId: string) => void;
  removeDish: (id: string) => void;
  isPlaceSaved: (placeId: string) => boolean;
  isDishSaved: (placeId: string, itemId: string) => boolean;
  getDishId: (placeId: string, itemId: string) => string;
  getTotalCount: () => number;
  getPinnedPlaces: () => WishlistPlace[];
  getPinnedDishes: () => WishlistDish[];
  getSavedPlaces: () => WishlistPlace[];
  getSavedDishes: () => WishlistDish[];
}

function sortWishlist<T extends { pinned: boolean; savedAt: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });
}

export { sortWishlist };

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      places: [],
      dishes: [],

      getDishId: (placeId, itemId) => `${placeId}-${itemId}`,

      togglePlace: (place) => {
        const existing = get().places.find((item) => item.placeId === place.placeId);
        if (existing) {
          set({
            places: get().places.filter((item) => item.placeId !== place.placeId),
          });
          return;
        }
        set({
          places: [
            {
              ...place,
              pinned: true,
              savedAt: new Date().toISOString(),
            },
            ...get().places,
          ],
        });
      },

      toggleDish: (dish) => {
        const id = get().getDishId(dish.placeId, dish.itemId);
        const existing = get().dishes.find((item) => item.id === id);
        if (existing) {
          set({
            dishes: get().dishes.filter((item) => item.id !== id),
          });
          return;
        }
        set({
          dishes: [
            {
              ...dish,
              id,
              pinned: true,
              savedAt: new Date().toISOString(),
            },
            ...get().dishes,
          ],
        });
      },

      togglePinPlace: (placeId) => {
        set({
          places: get().places.map((item) =>
            item.placeId === placeId ? { ...item, pinned: !item.pinned } : item,
          ),
        });
      },

      togglePinDish: (id) => {
        set({
          dishes: get().dishes.map((item) =>
            item.id === id ? { ...item, pinned: !item.pinned } : item,
          ),
        });
      },

      removePlace: (placeId) => {
        set({ places: get().places.filter((item) => item.placeId !== placeId) });
      },

      removeDish: (id) => {
        set({ dishes: get().dishes.filter((item) => item.id !== id) });
      },

      isPlaceSaved: (placeId) => get().places.some((item) => item.placeId === placeId),

      isDishSaved: (placeId, itemId) =>
        get().dishes.some((item) => item.id === get().getDishId(placeId, itemId)),

      getTotalCount: () => get().places.length + get().dishes.length,

      getPinnedPlaces: () => sortWishlist(get().places.filter((item) => item.pinned)),

      getPinnedDishes: () => sortWishlist(get().dishes.filter((item) => item.pinned)),

      getSavedPlaces: () => sortWishlist(get().places),

      getSavedDishes: () => sortWishlist(get().dishes),
    }),
    { name: "@hano/wishlist", storage: createSafePersistStorage() },
  ),
);
